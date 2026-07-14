# CECP — Centro de Especialidades (Guayaquil)

Sitio web del centro médico CECP, en producción en
**[cecponline.com](https://cecponline.com)**. Migrado de un único `index.html`
de 1.2 MB (ver [AUDITORIA.md](AUDITORIA.md) y `legacy/index-original.html`) a
**Astro 7 + TypeScript + Tailwind CSS 4**, con islas de React solo donde hay
interactividad real (carrusel, modales, partículas, globo 3D).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias (Node 22 recomendado, igual que el build de Hostinger) |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run check` | Verificación de tipos y errores |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` localmente para probar el build |

## Despliegue

Automático: Hostinger está conectado al repositorio de GitHub y **cada push a
`main` dispara build y publicación** en `cecponline.com` (preajuste Astro,
Node 22, salida `dist/`). No hay que subir archivos a mano.

Flujo de trabajo: rama → PR → merge a `main` → deploy solo. Antes de mergear,
correr `npm run check` y `npm run build` en local.

Si algún día hiciera falta desplegar a mano en otro hosting estático: subir el
**contenido** de `dist/` (incluye `.htaccess` con la 404 personalizada y el
cacheo de assets para Apache/LiteSpeed).

## Dónde se edita cada cosa

| Quiero cambiar... | Archivo |
|---|---|
| Teléfono, correo, dirección, redes, URL del sitio | `src/config.ts` |
| Especialidades, médicos, procedimientos de los modales | `src/data/especialidades.ts` |
| Reseñas | `src/data/testimonios.ts` |
| Colores y fuentes (tokens) | `src/styles/global.css` (`@theme`) |
| SEO base, Open Graph, favicon | `src/layouts/Base.astro` |
| Fotos | `src/assets/img/` (se piden por nombre sin extensión vía el helper `img()`; se optimizan solas en el build) |
| Loader de bienvenida y campanada (duración: `GRACIA`) | `src/components/Loader.astro` |

## Mantenimiento de seguridad

Hostinger escanea las dependencias tras cada deploy. Cuando reporte
vulnerabilidades: `npm audit` en local, actualizar los paquetes señalados,
`npm run check` + `npm run build` para validar, y push (el deploy re-escanea).
Última pasada: 2026-07-09, Astro 7.0.7 / esbuild 0.28.1, `npm audit` en 0.

## ⚠️ Pendientes

El orden y el detalle de estos pasos viven en `HANDOFF.md` (archivo local, no
versionado). Resumen:

1. **Cuenta Google oficial de la clínica** — dueña de Search Console, Analytics,
   Ads y Business Profile. Debe crearse ANTES de verificar nada (la verificación
   ata la propiedad a la cuenta que la inicia; no usar cuentas personales).
2. **Search Console + Google Business Profile** — verificar `cecponline.com`
   (DNS), enviar `https://cecponline.com/sitemap-index.xml`, dar de alta el
   perfil de Google Business (máximo retorno local, gratis).
3. **Consentimiento de cookies + privacidad** — banner con Consent Mode y
   actualización de la política de privacidad. Requisito PREVIO a encender GA4
   o Ads (hoy el sitio no pone ninguna cookie de rastreo).
4. **Google Analytics 4** — poner el ID real en `GA_ID` (`src/config.ts`); el
   hueco ya está cableado, incl. seguimiento de conversiones de WhatsApp.
5. **Google Ads** — solo con plan/presupuesto definido y medición ya montada.
6. **Textos legales (urgente: el sitio ya está en producción)** — `/privacidad`
   y `/terminos` son borradores que deben ser revisados por un profesional
   legal (datos de salud = datos sensibles bajo la LOPDP de Ecuador). Mientras
   tanto llevan `noindex` y quedan fuera del sitemap.
