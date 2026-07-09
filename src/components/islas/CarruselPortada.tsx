import { useEffect, useRef, useState } from 'react';

export interface Slide {
  src: string;
  alt: string;
  caption: string;
}

interface Props {
  slides: Slide[];
  /** ms entre slides */
  intervalo?: number;
}

/**
 * Carrusel de portada. Mejoras sobre el original:
 * - Botón de pausa/reanudar (WCAG 2.2.2: contenido en movimiento debe poder detenerse).
 * - No rota si el usuario prefiere movimiento reducido.
 */
export default function CarruselPortada({ slides, intervalo = 3200 }: Props) {
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion.current) setPausado(true);
  }, []);

  useEffect(() => {
    if (pausado || slides.length < 2) return;
    const id = setInterval(() => setActivo((i) => (i + 1) % slides.length), intervalo);
    return () => clearInterval(id);
  }, [pausado, slides.length, intervalo]);

  return (
    <div className="panel-foto">
      {slides.map((s, i) => (
        <div key={s.src} className={`slide${i === activo ? ' activa' : ''}`}>
          <img
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
          />
          {i === 0 && (
            <>
              <span className="nube nube1" aria-hidden="true">
                <svg viewBox="0 0 200 60" fill="#fff">
                  <ellipse cx="60" cy="40" rx="55" ry="18" />
                  <ellipse cx="110" cy="30" rx="45" ry="16" />
                  <ellipse cx="150" cy="42" rx="48" ry="15" />
                </svg>
              </span>
              <span className="nube nube2" aria-hidden="true">
                <svg viewBox="0 0 200 60" fill="#fff">
                  <ellipse cx="60" cy="40" rx="55" ry="18" />
                  <ellipse cx="110" cy="30" rx="45" ry="16" />
                  <ellipse cx="150" cy="42" rx="48" ry="15" />
                </svg>
              </span>
            </>
          )}
        </div>
      ))}
      <div className="foto-marco" />
      {slides.length > 1 && (
        <button
          type="button"
          className="carrusel-pausa"
          onClick={() => setPausado((p) => !p)}
          aria-label={pausado ? 'Reanudar carrusel' : 'Pausar carrusel'}
        >
          {pausado ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          )}
        </button>
      )}
      <div className="foto-cinta">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.3 11.8a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
        </svg>
        <span className="cinta-txt">{slides[activo]?.caption}</span>
      </div>
    </div>
  );
}
