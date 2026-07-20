import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

interface Props {
  /** Imagen de respaldo (croquis) si WebGL no está disponible */
  fallbackSrc: string;
  fallbackAlt: string;
  lat: number;
  lon: number;
}

/**
 * Globo terráqueo 3D interactivo centrado en Guayaquil.
 * Mejora sobre el original: `cobe` ahora es una dependencia local empaquetada
 * en el build (antes se importaba de un CDN en cada visita, sin control de versión
 * ni integridad). Mantiene el respaldo automático a imagen estática.
 */
export default function Globo({ fallbackSrc, fallbackAlt, lat, lon }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let globo: { destroy: () => void } | null = null;
    let ro: ResizeObserver | null = null;
    let quitarListeners: (() => void) | null = null;

    const iniciar = (): boolean => {
      const size = wrap.offsetWidth;
      if (!size) return false;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const basePhi = (-lon * Math.PI) / 180;
      let rot = basePhi;
      let arrastre = 0;
      let arrastrando: number | null = null;
      /** Inercia al soltar, en radianes por frame */
      let velocidad = 0;
      try {
        globo = createGlobe(canvas, {
          devicePixelRatio: 2,
          width: size * 2,
          height: size * 2,
          phi: basePhi,
          theta: 0.12,
          dark: 0,
          diffuse: 1.4,
          mapSamples: 16000,
          mapBrightness: 8.5,
          baseColor: [0.92, 0.96, 1],
          markerColor: [0.106, 0.435, 0.682],
          glowColor: [0.78, 0.9, 0.97],
          markers: [{ location: [lat, lon], size: 0.1 }],
          onRender: (state) => {
            if (arrastrando === null) {
              if (velocidad !== 0) {
                // Al soltar, el globo sigue girando y frena poco a poco
                arrastre += velocidad;
                velocidad *= 0.94;
                if (Math.abs(velocidad) < 0.0004) velocidad = 0;
              } else {
                rot += 0.0065;
              }
            }
            state.phi = rot + arrastre;
            state.width = size * 2;
            state.height = size * 2;
          },
        });
      } catch {
        setFallo(true);
        return true;
      }
      canvas.style.opacity = '1';
      setListo(true);

      // Radianes que gira el globo al arrastrar el dedo/ratón de lado a lado.
      // Relativo al tamaño del canvas: así el gesto recorre lo mismo en el móvil
      // que en escritorio (antes era un divisor fijo y en pantallas pequeñas el
      // mismo gesto giraba bastante menos).
      const SENSIBILIDAD = 3.4;
      let inicioX = 0;
      let arrastreInicial = 0;
      let ultimoX = 0;
      let ultimoT = 0;

      const alPresionar = (e: PointerEvent) => {
        arrastrando = e.pointerId;
        inicioX = ultimoX = e.clientX;
        ultimoT = e.timeStamp;
        arrastreInicial = arrastre;
        velocidad = 0;
        // Captura del puntero: el canvas sigue recibiendo los eventos aunque el
        // dedo se salga de él, sin necesidad de escuchar en `window`.
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          /* el puntero ya no está activo: se sigue sin captura */
        }
        canvas.style.cursor = 'grabbing';
      };

      const alMover = (e: PointerEvent) => {
        if (e.pointerId !== arrastrando) return;
        arrastre = arrastreInicial + ((e.clientX - inicioX) / size) * SENSIBILIDAD;
        const dt = e.timeStamp - ultimoT;
        if (dt > 0) {
          // px/ms → radianes por frame (~16.7 ms), para la inercia al soltar
          velocidad = ((e.clientX - ultimoX) / size) * SENSIBILIDAD * (16.7 / dt);
          ultimoX = e.clientX;
          ultimoT = e.timeStamp;
        }
      };

      const alSoltar = (e: PointerEvent) => {
        if (e.pointerId !== arrastrando) return;
        // Si el dedo se quedó quieto antes de levantarse, no hay impulso
        if (e.timeStamp - ultimoT > 100) velocidad = 0;
        arrastrando = null;
        canvas.style.cursor = 'grab';
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      };

      // `pointercancel`: el navegador se quedó con el gesto (p. ej. scroll
      // vertical). Se suelta sin inercia para no dar un tirón.
      const alCancelar = (e: PointerEvent) => {
        velocidad = 0;
        alSoltar(e);
      };

      canvas.addEventListener('pointerdown', alPresionar);
      canvas.addEventListener('pointermove', alMover, { passive: true });
      canvas.addEventListener('pointerup', alSoltar, { passive: true });
      canvas.addEventListener('pointercancel', alCancelar, { passive: true });
      quitarListeners = () => {
        canvas.removeEventListener('pointerdown', alPresionar);
        canvas.removeEventListener('pointermove', alMover);
        canvas.removeEventListener('pointerup', alSoltar);
        canvas.removeEventListener('pointercancel', alCancelar);
      };
      return true;
    };

    if (!iniciar()) {
      ro = new ResizeObserver((entradas) => {
        if (entradas[0] && entradas[0].contentRect.width > 0) {
          ro?.disconnect();
          iniciar();
        }
      });
      ro.observe(wrap);
    }
    // Si WebGL no rindió en 3.5 s, mostrar el croquis
    const timeout = setTimeout(() => {
      if (getComputedStyle(canvas).opacity === '0') setFallo(true);
    }, 3500);

    return () => {
      clearTimeout(timeout);
      ro?.disconnect();
      quitarListeners?.();
      globo?.destroy();
    };
  }, [lat, lon]);

  if (fallo) {
    return (
      <div className="globo-wrap">
        <img
          src={fallbackSrc}
          alt={fallbackAlt}
          loading="lazy"
          style={{ width: '100%', borderRadius: 24, boxShadow: '0 24px 60px rgba(14,58,93,.16)' }}
        />
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`globo-wrap${listo ? ' listo' : ''}`}>
      <canvas
        ref={canvasRef}
        aria-label="Globo terráqueo interactivo con la ubicación de CECP en Guayaquil, Ecuador"
      />
      <div className="globo-pin">
        <span className="mini-clinica" aria-hidden="true">
          <i className="mc f" />
          <i className="mc b" />
          <i className="mc l" />
          <i className="mc r" />
          <i className="mc t" />
        </span>
        <span className="pin-txt">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B6FAE" aria-hidden="true">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.3 11.8a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
          </svg>
          CECP · Guayaquil, Ecuador
        </span>
      </div>
    </div>
  );
}
