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
export const COORDENADAS = { lat: -2.19, lon: -79.88 };

export const REDES = {
  facebook: 'https://www.facebook.com/especialidadescecp/',
  instagram: 'https://www.instagram.com/cecp_especialidades/',
  tiktok: 'https://www.tiktok.com/@cecp_plus',
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
