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

    const iniciar = (): boolean => {
      const size = wrap.offsetWidth;
      if (!size) return false;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const basePhi = (-lon * Math.PI) / 180;
      let rot = basePhi;
      let arrastre = 0;
      let arrastrando: number | null = null;
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
            if (arrastrando === null) rot += 0.0065;
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

      let inicioX = 0;
      let arrastreInicial = 0;
      canvas.addEventListener('pointerdown', (e) => {
        arrastrando = e.pointerId;
        inicioX = e.clientX;
        arrastreInicial = arrastre;
        canvas.style.cursor = 'grabbing';
      });
      window.addEventListener(
        'pointermove',
        (e) => {
          if (arrastrando !== null) arrastre = arrastreInicial + (e.clientX - inicioX) / 140;
        },
        { passive: true }
      );
      window.addEventListener(
        'pointerup',
        () => {
          arrastrando = null;
          canvas.style.cursor = 'grab';
        },
        { passive: true }
      );
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
