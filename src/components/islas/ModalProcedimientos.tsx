import { useRef } from 'react';

interface EquipoFoto {
  src: string;
  alt: string;
  nombre: string;
}

interface Props {
  nombre: string;
  doctor: string;
  icono: string;
  intro: string;
  procedimientos: { icono: string; nombre: string }[];
  equiposTitulo?: string;
  equipos?: EquipoFoto[];
  cierre?: { titulo: string; texto: string };
  waHref: string;
}

/**
 * Botón "Ver procedimientos" + modal.
 * Mejoras sobre el original:
 * - <dialog> nativo: focus atrapado dentro del modal, Escape para cerrar y
 *   devolución del foco al botón, todo gratis del navegador.
 * - aria-label correcto (el original decía "Procedimientos de Procedimientos de ...").
 */
export default function ModalProcedimientos({
  nombre,
  doctor,
  icono,
  intro,
  procedimientos,
  equiposTitulo,
  equipos,
  cierre,
  waHref,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  const abrir = () => {
    ref.current?.showModal();
    document.documentElement.style.overflow = 'hidden';
  };
  const cerrar = () => {
    ref.current?.close();
  };

  return (
    <>
      <button type="button" className="btn btn-azul" onClick={abrir}>
        Ver procedimientos
      </button>
      <dialog
        ref={ref}
        className="pm"
        aria-label={`Procedimientos de ${nombre}`}
        onClose={() => {
          document.documentElement.style.overflow = '';
        }}
        onClick={(e) => {
          if (e.target === ref.current) cerrar();
        }}
      >
        <div className="pm-head">
          <div className="pm-ico" aria-hidden="true">
            {icono}
          </div>
          <div>
            <h3>Procedimientos de {nombre}</h3>
            <span>{doctor}</span>
          </div>
          <button type="button" className="pm-close" onClick={cerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="pm-body">
          <p className="pm-intro">{intro}</p>
          <div className="pm-grid">
            {procedimientos.map((p) => (
              <div key={p.nombre} className="pill">
                <span className="pico" aria-hidden="true">
                  {p.icono}
                </span>
                {p.nombre}
              </div>
            ))}
          </div>
          {equipos && equipos.length > 0 && (
            <>
              <h4 className="pm-sub">{equiposTitulo}</h4>
              <div className="pm-equipos">
                {equipos.map((eq) => (
                  <figure key={eq.nombre}>
                    <img src={eq.src} alt={eq.alt} loading="lazy" />
                    <figcaption>{eq.nombre}</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}
          {cierre && (
            <div className="pm-cierre">
              <h4>{cierre.titulo}</h4>
              <p>{cierre.texto}</p>
            </div>
          )}
        </div>
        <div className="pm-foot">
          <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener noreferrer">
            💬 Agendar cita por WhatsApp
          </a>
          <small>
            Escríbenos y con gusto te brindaremos toda la información sobre valores y
            disponibilidad.
          </small>
        </div>
      </dialog>
    </>
  );
}
