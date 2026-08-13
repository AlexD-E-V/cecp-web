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

### Verificación automática (CI)

`.github/workflows/ci.yml` corre esas mismas dos órdenes en GitHub Actions con
Node 22 —la versión del build de Hostinger— en **cada push a `main` y en cada
PR**. Como Hostinger publica con cada push sin revisar nada por el camino, sin
esto un error de tipos o un import roto se descubriría en el sitio ya en vivo.

El CI **no despliega**: solo avisa. Si sale en rojo, el deploy de Hostinger ya
ocurrió igual, así que conviene mirar el PR antes de mergear, no después.

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
| Calificación y nº de reseñas de la insignia de Google | `src/config.ts` → `RESENAS` |
| Fecha de última actualización de las páginas legales (visible y `lastmod` del sitemap) | `src/config.ts` → `LEGAL_ACTUALIZADO` |
| Especialidades, médicos, procedimientos de los modales | `src/data/especialidades.ts` |
| Textos de los testimonios | `src/data/testimonios.ts` |
| Colores y tokens de diseño | `src/styles/global.css` (`@theme`) |
| Tipografías (familias y pesos; se autohospedan en el build) | `astro.config.ts` → `fonts` |
| SEO base, Open Graph, favicon | `src/layouts/Base.astro` |
| Fotos | `src/assets/img/` (se piden por nombre sin extensión vía el helper `img()`; se optimizan solas en el build) |
| Loader de bienvenida y campanada (duración: `GRACIA`) | `src/components/Loader.astro` |

## Tipografías

Se **autohospedan**: Astro las descarga en el build (`fonts` en `astro.config.ts`)
y las sirve desde el propio dominio. **No añadir el `<link>` a
`fonts.googleapis.com`** — se quitó a propósito. Además de ahorrar dos conexiones
a servidores ajenos, evita enviar la IP de cada visitante a Google antes de que
haya consentido nada, que es lo que promete la política de privacidad.

Los tokens del sitio (`--font-display`, `--font-ui`, `--font-body` en
`global.css`) apuntan a las variables que genera Astro, así que para cambiar una
familia o un peso basta con editar `astro.config.ts`.

## Seguridad del servidor

`public/.htaccess` define cinco cabeceras: `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` y HSTS. El propio
archivo documenta por qué HSTS va sin `includeSubDomains` y por qué todavía no
hay `Content-Security-Policy`.

## Accesibilidad

Dos piezas que conviene no romper al tocar el maquetado:

- **Cada página tiene un `<main id="contenido">`.** El id no es decorativo: es el
  destino del enlace "Saltar al contenido" que `Base.astro` pone como primer
  elemento enfocable de todas las páginas. Al crear una página nueva hay que
  darle su `<main id="contenido">`, o ese enlace no llevará a ninguna parte.
- **El aviso de cookies va por encima del botón flotante de WhatsApp**
  (`z-index` 2100 vs 2000) y lo esconde mientras está abierto. Por debajo de
  ~736 px de ancho ambos ocupan la misma esquina: sin eso, tocar "Aceptar" en un
  móvil abría WhatsApp en vez de aceptar, y el consentimiento nunca se concedía.

## Mantenimiento de dependencias

Hostinger escanea las dependencias tras cada deploy. Cuando reporte
vulnerabilidades: `npm audit` en local, actualizar los paquetes señalados,
`npm run check` + `npm run build` para validar, y push (el deploy re-escanea).

> **Parar `npm run dev` antes de tocar dependencias.** `npm ci` borra y reinstala
> `node_modules` entero; si el servidor de desarrollo sigue vivo, Vite queda
> apuntando a archivos que ya no existen y el sitio se ve roto de forma engañosa:
> el HTML y el CSS siguen bien, pero **las cuatro islas de React (carrusel,
> partículas, modales y globo) dejan de aparecer**. No se ha roto nada del código
> — se arregla reiniciando el servidor.

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

Al modificar su texto (por ejemplo tras una revisión legal), **actualizar la
fecha en `LEGAL_ACTUALIZADO` (`src/config.ts`)**. De esa única fecha salen tanto
la fecha visible en la página —el texto en español se deriva de ella, no se
escribe a mano— como el `lastmod` que la página declara en el sitemap. El sitemap
se regenera solo en cada build; solo haría falta intervenir si cambiara la URL de
la página, en cuyo caso hay que añadir una redirección.

El resto de páginas **no lleva `lastmod` a propósito**: no rastreamos cuándo
cambió su contenido de verdad, y poner la fecha del build en todas afirmaría que
la portada cambia con cada despliegue. Google deja de fiarse del campo cuando ve
que siempre dice "hoy".

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
