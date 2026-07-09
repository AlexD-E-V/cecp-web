# CECP — Centro de Especialidades (Guayaquil)

Sitio web del centro médico CECP, migrado de un único `index.html` de 1.2 MB
(ver [AUDITORIA.md](AUDITORIA.md) y `legacy/index-original.html`) a
**Astro 5 + TypeScript + Tailwind CSS 4**, con islas de React solo donde hay
interactividad real (carrusel, modales, partículas, globo 3D).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run check` | Verificación de tipos y errores |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` localmente para probar el build |

El resultado del build (`dist/`) son archivos estáticos puros. Despliegue en
Hostinger: ejecutar `npm run build` y subir el **contenido** de `dist/` a
`public_html/` (incluye un `.htaccess` con la 404 personalizada y el cacheo de
assets). Sirve igual en cualquier otro hosting estático.

## Dónde se edita cada cosa

| Quiero cambiar... | Archivo |
|---|---|
| Teléfono, correo, dirección, redes, URL del sitio | `src/config.ts` |
| Especialidades, médicos, procedimientos de los modales | `src/data/especialidades.ts` |
| Reseñas | `src/data/testimonios.ts` |
| Colores y fuentes (tokens) | `src/styles/global.css` (`@theme`) |
| SEO base, Open Graph, favicon | `src/layouts/Base.astro` |
| Fotos | `src/assets/img/` (se optimizan solas en el build) |

## ⚠️ Pendientes

1. **Activación del dominio** — el canonical, el sitemap y el Open Graph ya
   apuntan al dominio oficial `https://cecponline.com` (definido en
   `src/config.ts` y `astro.config.ts`, siempre en sincronía). **Importante:**
   publicar este build solo cuando `cecponline.com` apunte de verdad al hosting
   de Hostinger (con SSL activo), para no repetir el canonical roto del sitio
   original (hallazgo C4 de la auditoría). El deploy anterior de Netlify se
   abandona.
2. **Google Search Console** — tras el lanzamiento: verificar la propiedad de
   `cecponline.com`, enviar `https://cecponline.com/sitemap-index.xml` y
   vincular el sitio en el perfil de Google Business del centro.
3. **Google Analytics 4** — `GA_ID` en `src/config.ts` está vacío, por lo que no
   se carga ningún script de Google (el HTML original enviaba una petición muerta
   con `G-XXXXXXXXXX`). Poner el ID real cuando exista la propiedad de GA4.
4. **Textos legales** — `/privacidad` y `/terminos` tienen una estructura de
   partida marcada como borrador. Deben ser revisados por un profesional legal
   (datos de salud = datos sensibles bajo la LOPDP de Ecuador) antes del
   lanzamiento con dominio propio. Mientras tanto llevan `noindex` y quedan
   fuera del sitemap.
5. **Imagen Open Graph** — `public/og-cecp.jpg` es la foto de la fachada
   (funciona y ya no está rota), pero idealmente debería reemplazarse por una
   imagen de 1200×630 diseñada para compartir.
