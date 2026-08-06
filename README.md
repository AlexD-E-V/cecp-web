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
| Teléfono, correo, dirección, coordenadas, redes, URL del sitio | `src/config.ts` |
| Horario de atención (sección visible, resumen de Contacto y JSON-LD a la vez) | `src/config.ts` → `HORARIO` |
| ID de Google Analytics (vacío = sin analítica ni aviso de cookies) | `src/config.ts` → `GA_ID` |
| Precio y descuento de la Membresía Familiar | `src/config.ts` → `MEMBRESIA` |
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

Conviene una pasada **trimestral** aunque no haya avisos: entre el 21 de julio y el
5 de agosto de 2026, sin tocar el proyecto, aparecieron 2 vulnerabilidades y 11
paquetes quedaron atrasados. Mantener el intervalo corto evita que actualizar cruce
versiones mayores.

Última pasada: **2026-08-05** — Astro 7.1.6 / React 19.2.8 / Tailwind 4.3.3,
`npm audit` en 0. Diferidas por ser versiones mayores: `cobe` 0.6.5→2.0.1 (afecta al
globo 3D) y `typescript` 5.9→7.0.

## Analítica y consentimiento

Google Analytics 4 está activo (`GA_ID` en `src/config.ts`). Si se deja vacío, no
se carga GA **ni** aparece el aviso de cookies: el sitio queda sin ninguna cookie
de rastreo.

Funciona con **Consent Mode v2**: todo arranca denegado y la analítica solo se
activa si el visitante acepta. Las cookies publicitarias están denegadas siempre
(la clínica no hace publicidad).

El consentimiento es **revocable**, como exige la LOPDP. Cualquier elemento con el
atributo `data-cecp-cookies` reabre el aviso — hoy el enlace del pie de página y el
de la política de privacidad. Al rechazar no solo se deniega el consentimiento:
también se borran las cookies `_ga*` ya escritas.

Las conversiones de WhatsApp y llamada están instrumentadas en
`src/layouts/Base.astro`.

## Páginas legales

`/privacidad` y `/terminos` están publicadas, indexadas y en el sitemap, con fecha
de última actualización visible.

Al modificar su texto (por ejemplo tras una revisión legal), **actualizar las
constantes `ACTUALIZADO_ISO` y `ACTUALIZADO_TXT`** al inicio de cada página. El
sitemap se regenera solo en cada build; solo haría falta intervenir si cambiara la
URL de la página, en cuyo caso hay que añadir una redirección.

## ⚠️ Pendientes

**No queda trabajo de código bloqueante.** Lo abierto son trámites y decisiones con
la clínica, detallados en [PENDIENTES.md](PENDIENTES.md). Resumen:

1. **Cuenta de Google oficial de la clínica** — hoy Analytics y Search Console
   cuelgan de una cuenta técnica del desarrollador. La verificación ata la
   propiedad a la cuenta que la inicia, así que la clínica debe ser la dueña y el
   desarrollador un administrador delegado.
2. **Acceso a la ficha de Google Business** — ya está reclamada y gestionada por un
   tercero; hay que averiguar quién. Incluye alinear el horario de la ficha con el
   de la web.
3. **Correo del dominio** — gratis solo el primer año; avisar del costo antes de
   que sorprenda.
4. **Revisión legal** de `/privacidad` y `/terminos` por un profesional (datos de
   salud = datos sensibles bajo la LOPDP de Ecuador).
5. **Redacción de "Emergencias 24/7"** — confirmar con el médico que se coordinan
   por WhatsApp y decidir si se explicita en la web.
6. **Marketing** — Search Console → Business Profile → leer los datos que GA4 ya
   recoge → recién entonces, Google Ads.
