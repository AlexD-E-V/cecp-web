/**
 * Resolvedor de imágenes por nombre base, sin extensión.
 *
 * Todo el código pide fotos con `img('esp-cardiologia')` en lugar de importar
 * `esp-cardiologia.jpg` directamente. Así se puede reemplazar cualquier archivo
 * por su versión .webp (mismo nombre, otra extensión) sin tocar una sola línea
 * de código: el helper encuentra el archivo nuevo solo.
 *
 * Si conviven dos extensiones del mismo nombre (p. ej. .jpg viejo y .webp
 * nuevo), gana la de mejor formato según PREFERENCIA.
 */
import type { ImageMetadata } from 'astro';

const modulos = import.meta.glob<{ default: ImageMetadata }>('./*.{webp,avif,png,jpg,jpeg}', {
  eager: true,
});

const PREFERENCIA = ['webp', 'avif', 'png', 'jpg', 'jpeg'] as const;

export function img(nombre: string): ImageMetadata {
  for (const ext of PREFERENCIA) {
    const modulo = modulos[`./${nombre}.${ext}`];
    if (modulo) return modulo.default;
  }
  const disponibles = Object.keys(modulos)
    .map((ruta) => ruta.replace('./', ''))
    .sort()
    .join(', ');
  throw new Error(
    `[img] No existe ninguna imagen llamada "${nombre}" en src/assets/img/. Disponibles: ${disponibles}`
  );
}
