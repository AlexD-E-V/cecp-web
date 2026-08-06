/**
 * Datos de contacto y configuración del sitio — ÚNICA fuente de verdad.
 * Cambiar el número de WhatsApp, el correo o la dirección = editar solo este archivo.
 */

// Dominio oficial. Mantener en sincronía con `site` en astro.config.ts.
// Publicar este build solo cuando cecponline.com ya apunte al hosting
// (canonical hacia un dominio muerto = hallazgo C4 de la auditoría).
export const SITE_URL = 'https://cecponline.com';

// ID de medición de Google Analytics 4. Vacío = no se carga GA.
export const GA_ID = 'G-H84YLZ124S';

export const NOMBRE = 'CECP · Centro de Especialidades';
export const NOMBRE_LEGAL = 'CECP - Centro de Especialidades';

export const TELEFONO = '593995861458';
export const TELEFONO_DISPLAY = '099 586 1458';
export const TELEFONO_ADICIONAL_DISPLAY = '099 314 9554';
export const EMAIL = 'cecpespecialidades@hotmail.com';

export const DIRECCION = 'Cdla. Atarazana Mz 02 Villa 45, Av. Pedro José Menéndez Gilbert';
export const DIRECCION_CORTA = 'Atarazana, Av. Pedro Menéndez Gilbert, Guayaquil, Ecuador';
export const REFERENCIA = 'Pasando la estación de la Metrovía, cerca de SOLCA · Parqueo disponible';
/**
 * Ubicación exacta del local, tomada de la ficha de Google Maps (mismo CID que
 * REVIEW_URL: 0x5771bcfa1d5c2389). Alimenta el `geo` del JSON-LD y el marcador
 * del globo 3D.
 *
 * Necesita 5+ decimales: dos decimales equivalen a ~1,1 km de imprecisión (los
 * valores redondeados anteriores caían a ~1,97 km del consultorio). Al copiarlas
 * de una URL de Maps hay que usar el par `!3d!4d` —la ubicación del negocio—,
 * no el `@lat,lon` inicial, que es solo el centro de la cámara.
 */
export const COORDENADAS = { lat: -2.1722918, lon: -79.8798405 };

/**
 * Horario de atención — ÚNICA fuente de verdad.
 * Lo consumen la sección visible (Horario.astro), el resumen de Contacto y el
 * JSON-LD de la portada. Cambiar el horario = editar solo este bloque.
 *
 * El horario válido es el APROBADO POR EL TITULAR y publicado en esta web. Si la
 * ficha de Google Maps muestra otro, se corrige la ficha (ver PENDIENTES.md §2.b).
 */
export const HORARIO = {
  /**
   * Único tramo de PUERTA ABIERTA sin cita previa. Es lo que se declara a Google
   * como `openingHoursSpecification`, porque en schema.org ese campo significa
   * "el local está abierto al público", no "hay disponibilidad coordinada".
   */
  consultorio: {
    diasSchema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    abre: '07:00',
    cierra: '16:00',
  },

  /** Filas de la tarjeta visible, en orden. `punto` = color del indicador. */
  filas: [
    {
      etiqueta: 'Atención en consultorio · Lunes a Viernes',
      valor: '7:00 AM — 4:00 PM',
      punto: '',
    },
    {
      etiqueta: 'Atención con cita previa · Lunes a Domingo',
      valor: '24 horas / 7 días',
      punto: 'pto-azul',
    },
    { etiqueta: 'Atención médica a domicilio', valor: 'Con cita previa', punto: '' },
    // Las emergencias se COORDINAN por WhatsApp: el equipo no permanece en el
    // consultorio 24/7. Por eso no entran en `consultorio` (horas de puerta
    // abierta). Pendiente de confirmar con el médico si se explicita en la web
    // para que nadie se presente de madrugada — ver PENDIENTES.md §5.
    { etiqueta: 'Emergencias médicas', valor: '24/7', punto: 'pto-urgente' },
  ],

  /** Resumen de una línea para la sección de Contacto. */
  resumen: 'Consultorio: Lunes a Viernes, 7:00 AM – 4:00 PM · Atención 24/7 con cita previa',

  /**
   * Disponibilidad que la web anuncia FUERA del horario de consultorio. Va al
   * JSON-LD como `availableService`, no como horas de apertura: así Google
   * conoce estos servicios sin que la ficha declare el local abierto 24/7 (lo
   * que llevaría a un paciente a presentarse en la puerta de madrugada).
   */
  serviciosExtendidos: [
    'Consulta médica con cita previa los 7 días de la semana, 24 horas',
    'Atención médica a domicilio con cita previa',
    'Atención de emergencias médicas 24/7',
    'Convenios de internación en clínicas y hospitales',
  ],
};

export const REDES = {
  facebook: 'https://www.facebook.com/especialidadescecp/',
  instagram: 'https://www.instagram.com/cecp_especialidades/',
  tiktok: 'https://www.tiktok.com/@cecp_plus',
};

/**
 * Insignia de reseñas de Google que se muestra sobre los testimonios.
 *
 * ⚠️ Son datos que envejecen solos: hay que cotejarlos con la ficha real de
 * Google cada cierto tiempo (revisión semestral del plan de mantenimiento).
 * No entran en el JSON-LD a propósito: Google ignora —y puede penalizar— las
 * valoraciones que un sitio se autodeclara. Las reseñas reales viven en Maps.
 *
 * Última comprobación contra la ficha: 2026-07-08.
 */
export const RESENAS = {
  calificacion: '5.0',
  total: 68,
};

export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=CECP+Centro+de+Especialidades+Av+Pedro+Men%C3%A9ndez+Gilbert+Atarazana+Guayaquil';
export const MAPS_SHARE = 'https://maps.app.goo.gl/8g8G5zC1cHTYJM6p6';
export const REVIEW_URL = 'https://g.page/r/CYkjXB36vHFXEAE/review';

/** Enlace de WhatsApp con mensaje pre-llenado. */
export function waLink(mensaje: string): string {
  return `https://wa.me/${TELEFONO}?text=${encodeURIComponent(mensaje)}`;
}

export const MSG_CITA = 'Hola CECP, quiero agendar una cita médica.';

/** Membresía Familiar CECP — el precio y el descuento se usan en la sección y en el JSON-LD. */
export const MEMBRESIA = {
  nombre: 'Membresía Familiar CECP',
  /** Valor mensual en USD */
  precio: 50,
  /** Descuento máximo (%) en las especialidades */
  descuento: 40,
  mensajeWhatsApp:
    'Hola CECP, quiero información sobre la Membresía Familiar de $50 mensuales.',
};
