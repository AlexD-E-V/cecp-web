import { useEffect, useRef } from 'react';

interface Props {
  nPC: number;
  nMovil: number;
  rMin: number;
  rMax: number;
  oMin: number;
  oMax: number;
  colPunto: string;
  colCruz: string;
  plx: number;
}

interface Particula {
  x: number;
  y: number;
  r: number;
  d: number;
  v: number;
  o: number;
  cruz: boolean;
}

/**
 * Canvas decorativo de partículas con parallax por profundidad.
 * Se dibuja sobre la sección padre (position:absolute). Se pausa fuera
 * del viewport y se desactiva con prefers-reduced-motion.
 */
export default function Particulas(cfg: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    // La isla vive envuelta en <astro-island> (display:contents, sin dimensiones):
    // la sección real hay que buscarla con closest(), no con parentElement.
    const sec = cv?.closest('section');
    if (!cv || !sec || !(sec instanceof HTMLElement)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cv.remove();
      return;
    }
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const esMovil = matchMedia('(pointer:coarse)').matches || innerWidth < 980;
    const N = esMovil ? cfg.nMovil : cfg.nPC;
    // Búfer a resolución física (tope 2x) para partículas nítidas en pantallas retina
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let parts: Particula[] = [];
    let activo = false;
    let prog = 0;
    /** id del frame pendiente: garantiza que solo haya UN bucle vivo */
    let frame = 0;

    const medir = () => {
      W = sec.offsetWidth;
      H = sec.offsetHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const crear = () => {
      parts = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * (cfg.rMax - cfg.rMin) + cfg.rMin,
        d: Math.random() * 0.7 + 0.3,
        v: Math.random() * 0.28 + 0.1,
        o: Math.random() * (cfg.oMax - cfg.oMin) + cfg.oMin,
        cruz: Math.random() < 0.18,
      }));
    };
    const pintar = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const py = p.y - prog * cfg.plx * p.d;
        ctx.globalAlpha = p.o;
        if (p.cruz) {
          ctx.fillStyle = cfg.colCruz;
          const s = p.r * 2.6;
          ctx.fillRect(p.x - s / 2, py - s / 6, s, s / 3);
          ctx.fillRect(p.x - s / 6, py - s / 2, s / 3, s);
        } else {
          ctx.fillStyle = cfg.colPunto;
          ctx.beginPath();
          ctx.arc(p.x, py, p.r, 0, 6.283);
          ctx.fill();
        }
        p.y -= p.v * p.d;
        if (p.y < -12) {
          p.y = H + 12;
          p.x = Math.random() * W;
        }
      }
      ctx.globalAlpha = 1;
      frame = activo ? requestAnimationFrame(pintar) : 0;
    };

    medir();
    crear();
    const ro = new ResizeObserver(() => {
      medir();
      crear();
    });
    ro.observe(sec);
    const io = new IntersectionObserver((en) => {
      en.forEach((x) => {
        // Sin este corte, dos avisos seguidos de "visible" arrancaban un
        // segundo bucle sobre el que ya corría: el canvas se repintaba el
        // doble de veces por frame, gastando batería sin que se notara nada.
        if (x.isIntersecting === activo) return;
        activo = x.isIntersecting;
        if (activo && !frame) frame = requestAnimationFrame(pintar);
      });
    });
    io.observe(sec);
    const onScroll = () => {
      const r = sec.getBoundingClientRect();
      prog = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height))) - 0.5;
    };
    addEventListener('scroll', onScroll, { passive: true });

    return () => {
      activo = false;
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className="particulas-canvas" aria-hidden="true" />;
}
