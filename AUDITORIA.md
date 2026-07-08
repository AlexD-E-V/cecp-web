# Auditoría técnica — Sitio web CECP (Centro de Especialidades, Guayaquil)

**Fecha:** 8 de julio de 2026
**Archivo auditado:** `index (2).html` (1,522 líneas, 1.21 MB)
**Sitio en producción:** https://dapper-druid-c8cd5c.netlify.app/
**Alcance:** auditoría de código, rendimiento medido, SEO, accesibilidad y justificación técnica de la migración a un entorno modular (Astro + React + TypeScript + Tailwind CSS). **No se modificó ninguna línea del código original.**

---

## 1. Resumen ejecutivo

La página **funciona y se ve profesional**, y eso hay que decirlo primero. Para alguien que recién empieza, el nivel de detalle en SEO, animaciones y estructura semántica está muy por encima del promedio. No estamos "rescatando" un sitio roto: estamos preparando un sitio que ya convierte para que pueda **crecer sin colapsar**.

Dicho esto, la auditoría encontró tres categorías de problemas:

1. **Un problema de arquitectura de carga** que sus pruebas de velocidad no detectaron (explicado en §3): el 92% del archivo son imágenes incrustadas en base64, lo que anula el lazy-loading, anula la caché del navegador e infla la transferencia un 33%.
2. **Errores concretos que hay que corregir sí o sí**, migre o no migre (§5): imagen de Open Graph rota, ID de Analytics placeholder en producción, enlaces legales muertos, canonical apuntando a un dominio que aún no existe.
3. **Deuda de mantenibilidad** (§4): el número de WhatsApp está copiado ~15 veces, el SVG del logo de Google 5 veces, el menú de navegación 2 veces, y el CSS crece por parches que se sobreescriben entre sí. Hoy no duele; dolerá en la tercera petición de cambio del cliente.

**Recomendación:** migrar a Astro + TypeScript + Tailwind, con React solo en las islas interactivas. La justificación completa —incluyendo qué **no** mejora con la migración, porque hay que ser honestos— está en §6.

---

## 2. Lo que está bien hecho (y debe conservarse en la migración)

Es importante reconocerlo, porque la migración debe **preservar** estas decisiones, no pisarlas:

| Área | Qué hizo bien |
|---|---|
| **SEO técnico** | `meta description`, `canonical`, Open Graph completo, Twitter Cards, geo tags (`geo.position`, `ICBM`), y **dos bloques JSON-LD** (`MedicalClinic` con horarios/servicios/coordenadas + `Physician` por cada médico). Esto es nivel profesional. |
| **HTML semántico** | `<header>`, `<nav>`, `<section>`, `<footer>`, un solo `<h1>` (oculto con `.sr-only` para que el logo no lo reemplace visualmente), jerarquía de encabezados correcta. |
| **Accesibilidad básica** | `aria-label` en botones e iconos, `role="dialog"` + `aria-modal` en modales, cierre con tecla Escape, `alt` descriptivos y en español en todas las fotos. |
| **Movimiento responsable** | `@media (prefers-reduced-motion: reduce)` desactiva todas las animaciones, y el JS lo respeta también (partículas y carrusel se apagan). Poquísima gente hace esto. |
| **JS eficiente** | `IntersectionObserver` para los reveals, `requestAnimationFrame` con throttling para el parallax, listeners `{passive:true}`, partículas que se pausan fuera del viewport. |
| **Degradación elegante** | El globo 3D (librería `cobe` desde CDN) tiene fallback automático a una imagen estática si WebGL falla o el CDN no responde. |
| **Enfoque a conversión** | CTA de WhatsApp con mensaje pre-llenado distinto por especialidad, botón flotante, tracking de conversiones preparado para GA4/Google Ads. |

**Conclusión de esta sección:** el problema del sitio no es de criterio ni de diseño. Es de **arquitectura de archivo**, que es exactamente lo que un framework resuelve.

---

## 3. Mediciones reales (por qué "mis pruebas dan rápido" es cierto e incompleto a la vez)

Mediciones hechas hoy sobre el archivo local y el sitio en producción:

| Métrica | Valor medido |
|---|---|
| Peso del HTML (sin comprimir) | **1,214,493 bytes (1.21 MB)** |
| Transferencia real desde Netlify (Brotli) | **747 KB** |
| Código real (HTML + CSS + JS) | **~104 KB** (8.5% del archivo) |
| Imágenes en base64 | **26 imágenes, 813 KB decodificados** (91.5% del archivo) |
| Sobrecoste de codificar en base64 | **+33%** (813 KB de imagen → ~1.08 MB de texto) |
| Cache-Control en producción | `max-age=0, must-revalidate` (revalida en cada visita) |
| Loader artificial | **3 segundos fijos** bloqueando la página en cada visita |

### 3.1 Por qué sus pruebas dieron bien

Sus pruebas no mienten. En una conexión de escritorio con buena banda ancha, 747 KB en una sola petición con Brotli desde el edge de Netlify baja en ~1 segundo. Un solo archivo = un solo round-trip = cero cascada de peticiones. **En ese escenario, el sitio es genuinamente rápido.**

### 3.2 Lo que las pruebas no midieron

1. **El público objetivo es móvil.** Todo el sitio empuja a agendar por WhatsApp: sus visitantes están en un celular, muchos en 4G/3G en Guayaquil. A 5 Mbps efectivos, 747 KB son ~1.2 s solo de descarga **antes de pintar nada**, porque el navegador no puede renderizar el HTML a medias cuando el CSS y las imágenes vienen dentro del mismo archivo. A eso se suman los **3 segundos del loader artificial**. Percepción real en móvil: 4–5 segundos de pantalla de carga.

2. **El `loading="lazy"` que escribió no funciona.** Está bien puesto en el `<img>`, pero con una URI `data:` no hay nada que cargar perezosamente: **los bytes ya viajaron dentro del HTML**. Las 26 imágenes se descargan siempre, incluidas las 5 fotos de equipos médicos que viven dentro de modales que la mayoría de visitantes jamás abre. Es la trampa clásica del base64: el atributo está, el beneficio no.

3. **La caché del navegador está anulada.** Con imágenes en archivos separados, un visitante recurrente (o alguien que navega entre futuras páginas) descargaría ~25 KB de HTML y todas las imágenes saldrían de caché. Hoy, cambiar **una letra** de un testimonio invalida el blob completo: el próximo visitante recurrente vuelve a bajar 747 KB. Con `max-age=0`, cada visita revalida; si el ETag cambió (y cambia con cualquier edición), se retransmite todo.

4. **El base64 comprime mal.** Un JPEG ya está comprimido; codificarlo a base64 y pasarle Brotli encima recupera poco. Por eso 813 KB de imágenes terminan en 747 KB transferidos: la compresión casi no ayuda con el 92% del archivo. En archivos separados, esas mismas fotos convertidas a AVIF/WebP con tamaños responsivos (`srcset`) pesarían **~200–300 KB en total**, y solo se descargarían las visibles.

**Resumen honesto:** el sitio es rápido en el mejor escenario y mediocre en el escenario que más importa (móvil, primera visita, red media). Y el margen de mejora no viene de "usar un framework" como magia, sino de lo que el framework hace posible: **imágenes como assets separados, optimizados y cacheables.**

---

## 4. Hallazgos técnicos

Ordenados por severidad. Los marcados 🔴 deben corregirse aunque nunca se migre.

### 🔴 Críticos

| # | Hallazgo | Detalle | Impacto |
|---|---|---|---|
| C1 | **Open Graph roto** | `og:image` y el `logo` del JSON-LD apuntan a `https://www.cecp.com.ec/og-cecp.jpg`, un dominio que **todavía no existe**. | Cada vez que alguien comparte el sitio por WhatsApp (¡el canal principal del negocio!) la vista previa sale **sin imagen**. |
| C2 | **Analytics placeholder en producción** | `gtag/js?id=G-XXXXXXXXXX` se envía tal cual. | Petición muerta a Google en cada visita, cero datos recolectados, y el código de conversiones (`trackConv`) no registra nada. |
| C3 | **Enlaces legales muertos** | "Política de privacidad", "Términos y condiciones" y "Protección de datos de pacientes" son `href="#"`. | Para un **centro médico** que capta pacientes, no tener política de privacidad ni de protección de datos publicada es un riesgo legal (datos de salud = datos sensibles bajo la LOPDP de Ecuador), no solo un detalle estético. |
| C4 | **Canonical a dominio inexistente** | `<link rel="canonical" href="https://www.cecp.com.ec/">` mientras el sitio vive en `netlify.app`. | Le está diciendo a Google "la versión oficial de esta página está en otro sitio (que responde error)". Puede impedir por completo la indexación de la URL de Netlify. Hay que decidir: o se indexa el subdominio de Netlify (canonical a sí mismo) o se marca `noindex` hasta tener el dominio real. |

### 🟠 Importantes

| # | Hallazgo | Detalle |
|---|---|---|
| I1 | **92% del archivo es base64** | Ver §3. Es el hallazgo estructural del que se derivan el peso, la caché anulada y el lazy-loading inútil. |
| I2 | **Loader artificial de 3 s** | `setTimeout(..., 3000)` fijo + `overflow:hidden` en `<body>`. No espera a que algo cargue: **retrasa a todos por igual**, incluso al visitante con fibra que tenía la página lista en 400 ms. Un loader debe ocultar carga real, no fabricar espera. Recomendación: quitarlo o ligarlo al evento `load` con un máximo de ~800 ms. |
| I3 | **Secuestro global de clics** | Un listener en fase de captura hace `preventDefault()` sobre **todo** `a[href^="#"]` del documento. Consecuencias: rompe abrir-en-pestaña-nueva/clic-central sobre anclas, y es la razón de que los enlaces legales `href="#"` parezcan "funcionar" (en realidad se los traga el handler). El comentario del código dice que fue para "visores embebidos"; en un navegador normal, `scroll-behavior:smooth` + `scroll-margin-top` (que **ya tiene puestos** en el CSS) hacen esto solo, sin JS. |
| I4 | **Sonido de bienvenida sintetizado** | Un acorde se dispara en el primer `pointerdown`/`keydown` del usuario. Suena a detalle simpático, pero: sorprende al usuario (nadie espera audio en la web de una clínica), no hay forma de desactivarlo, e ignora `prefers-reduced-motion`. Recomendación: eliminarlo. |
| I5 | **`aggregateRating` autodeclarado** | El JSON-LD declara `5.0` con `68 reseñas` en el propio sitio. Google considera las reseñas alojadas en el sitio de la propia entidad como *self-serving* y **desde 2019 no muestra estrellas para ellas** en LocalBusiness; en el peor caso lo trata como marcado spam. Las reseñas reales viven en Google Maps y ahí es donde pesan. Recomendación: retirar el bloque `aggregateRating`. |
| I6 | **Dependencia de CDN en runtime** | El globo 3D importa `cobe` desde jsdelivr en cada visita, sin Subresource Integrity. Si el CDN cambia o es comprometido, ejecuta código arbitrario en el sitio. (El fallback ya existe, bien; pero la librería debería empaquetarse local.) |
| I7 | **Accesibilidad de modales incompleta** | Los modales tienen `role="dialog"` y Escape (bien), pero **no atrapan el foco** (con Tab te sales del modal hacia la página tapada) y al cerrar no devuelven el foco al botón que los abrió. El carrusel de portada rota solo y **no tiene control de pausa** (WCAG 2.2.2). El botón hamburguesa no tiene `aria-expanded`. |
| I8 | **Bug de texto en `aria-label`** | Los tres modales dicen `aria-label="Procedimientos de Procedimientos de Cardiología"` (duplicación por concatenación). Un lector de pantalla lo lee literal. Es cosmético, pero es exactamente el tipo de bug que TypeScript + un componente `<Modal titulo="...">` hacen imposible. |

### 🟡 Menores

- **Sin repositorio git**: la carpeta no está versionada. Cualquier edición sin respaldo puede destruir trabajo. (Primer paso de cualquier plan: `git init`.)
- **Sin `robots.txt`, `sitemap.xml` ni página 404** personalizada.
- **Estilos inline** dispersos (`style="..."` en ~15 elementos) que escapan a cualquier sistema.
- **CSS que crece por parches**: hay dos bloques `<style>` y reglas que se redefinen más abajo para "arreglar" las de arriba (`.panel-foto` se define 3 veces; `.ubi-grid` pasa de 2 columnas a 1 en un parche posterior; hay comentarios tipo `/* fix: ... */`). Es el patrón *append-only*: nadie borra CSS viejo por miedo a romper algo, y el archivo solo puede crecer.
- **`meta keywords`**: ignorada por Google desde 2009. Inofensiva, pero es ruido.

---

## 5. Correcciones obligatorias, con o sin migración

Si mañana se decidiera **no** migrar, esto igual hay que hacerlo:

1. Subir una imagen OG real y apuntar `og:image` a una URL que exista (puede ser la de Netlify por ahora). — *C1*
2. Poner el ID real de GA4 o retirar el script hasta tenerlo. — *C2*
3. Redactar y publicar política de privacidad y términos (aunque sea una página estática simple). — *C3*
4. Corregir el `canonical` (a la URL de Netlify, o `noindex` temporal hasta tener dominio). — *C4*
5. Retirar `aggregateRating` del JSON-LD. — *I5*
6. Quitar el loader de 3 s o ligarlo a la carga real. — *I2*
7. `git init` y primer commit del estado actual, antes de tocar nada.

---

## 6. La pregunta central: ¿por qué migrar si "ya funciona"?

Esta es la sección que pediste para justificar la decisión ante el autor. La respuesta honesta tiene dos mitades.

### 6.1 Lo que la migración NO mejora (seamos justos)

- **El sitio renderizado no se verá diferente ni "correrá" más rápido por usar un framework.** Astro genera HTML estático; el navegador del visitante ejecuta lo mismo que hoy. Si el sitio nunca fuera a cambiar, un solo archivo sería defendible.
- **Un framework no arregla errores de contenido** (C1–C4 se arreglan a mano igual).
- **Añade complejidad de herramienta**: Node, `node_modules`, un paso de build, un deploy que ya no es "arrastrar un archivo". Ese costo es real y hay que asumirlo conscientemente.

Si el argumento fuera solo "un archivo es pecado", el autor tendría razón en resistirse: **funcionar, funciona.**

### 6.2 Lo que SÍ mejora, mapeado a problemas reales de ESTE archivo

El argumento no es dogma, es que cada problema medido en §3 y §4 corresponde exactamente a una capacidad del entorno propuesto:

| Problema real encontrado | Qué lo resuelve | Resultado esperado |
|---|---|---|
| 813 KB de imágenes base64, lazy-loading anulado, caché anulada (I1) | **`astro:assets`**: imágenes como archivos, convertidas a AVIF/WebP, con `srcset` responsivo y lazy-loading que ahora sí funciona | Primera carga: de 747 KB → **~80–120 KB** (HTML+CSS+hero). Total con todas las imágenes: ~300 KB, y solo si se scrollea todo. Visitas repetidas: casi todo desde caché. |
| Número de WhatsApp copiado ~15 veces; si la clínica cambia de número hay que encontrar y editar 15 lugares sin equivocarse | **Un componente `<BotonWhatsApp mensaje="...">` y una constante `TELEFONO`** en un archivo de configuración | Cambiar el número = editar **1 línea**. Imposible que quede un botón con el número viejo. |
| SVG de Google repetido 5×, tarjeta de testimonio repetida 6×, tarjeta de especialidad 7×, menú duplicado (desktop + móvil), modal duplicado 3× | **Componentes** (`<Testimonio>`, `<TarjetaEspecialidad>`, `<Modal>`) que se escriben una vez y reciben datos | Agregar el octavo especialista = añadir un objeto a un array de datos, no copiar-pegar-editar 25 líneas de HTML rezando no romper un `<div>`. |
| `aria-label="Procedimientos de Procedimientos de..."` (I8): bug de copiar-pegar-editar | **TypeScript** + componentes: el título se pasa una vez como prop tipada | Esta clase de bug deja de poder existir. El compilador además avisa si un componente recibe datos mal formados. |
| CSS que solo crece por parches, reglas que se pisan entre sí, estilos inline sueltos | **Tailwind**: los estilos viven junto al elemento que los usa; borrar un componente borra su CSS; el build purga lo no usado | El CSS deja de ser una arqueología de capas. El "miedo a borrar" desaparece porque el alcance de cada estilo es visible. |
| Todo el negocio en una sola URL: "cardiólogo en Guayaquil" y "pediatra en Guayaquil" compiten por posicionar **la misma página** | **Rutas**: `/especialidades/cardiologia`, `/especialidades/pediatria`, cada una con su title, description, JSON-LD y contenido propio | Es la palanca de SEO más grande disponible: hoy es imposible; con páginas por especialidad, cada búsqueda tiene una página dedicada. Un blog de salud (SEO local) se vuelve trivial con content collections. |
| Interactividad (modales, carrusel, partículas, globo) mezclada en un `<script>` de 300 líneas al final del archivo | **Islas de Astro**: cada pieza interactiva es un componente React aislado que se hidrata solo; el resto de la página es HTML puro sin JS | El globo 3D deja de importar desde CDN (I6, `cobe` se instala como dependencia con versión fijada). Los modales se reescriben con `<dialog>` nativo, que da el focus-trap gratis (I7). |
| Sin versionado, sin forma de revisar cambios, sin poder trabajar dos personas | **Git + archivos pequeños**: un diff de 10 líneas en `Testimonios.astro` en vez de "algo cambió dentro de un archivo de 1.2 MB" | Colaboración real: tú puedes tocar el hosting/deploy mientras él edita contenido, sin pisarse. |

### 6.3 El argumento de fondo (para la conversación con él)

El criterio no es "un archivo está mal", es **frecuencia de cambio**:

- Una página que se escribe una vez y no se toca más → un archivo está bien.
- La web de una clínica **viva** — que va a querer subir fotos nuevas, sumar un médico, cambiar horarios, publicar artículos para SEO, cambiar el número de WhatsApp — se edita constantemente. Y en un archivo de 1,522 líneas, **el costo de cada edición crece con el tiempo**: hoy encuentra las cosas porque lo escribió él hace poco; en 8 meses, ni él.

Su prueba de velocidad midió el presente. La arquitectura se elige por el futuro. Y hay un dato que zanja la discusión técnica: **su optimización más deliberada (el `loading="lazy"`) no está funcionando por culpa del formato de un solo archivo.** El archivo único no es solo incómodo de mantener: está anulando activamente sus propias buenas decisiones.

### 6.4 Por qué Astro específicamente (y no Next.js, o React puro)

- **Astro genera HTML estático y envía 0 KB de JavaScript por defecto.** Este sitio es 95% contenido estático: es el caso de uso exacto de Astro. Con Next.js o un SPA de React pagaríamos hidratación y runtime para una página que no lo necesita — sería empeorar el rendimiento actual, no mejorarlo.
- **React solo donde hay interactividad real** (islas): modales, carrusel, globo. Lo demás ni siquiera lleva JS.
- **El resultado del build sigue siendo carpeta de archivos estáticos**: se despliega igual en Netlify hoy y en Hostinger mañana, sin servidor Node. La migración de hosting que planeas es un simple cambio de destino del build.
- Content collections tipadas: médicos, especialidades, procedimientos y testimonios como datos (`.json`/`.md`) validados por esquema — editar contenido sin tocar componentes.

---

## 7. Arquitectura propuesta

```
cecp-web/
├── astro.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── config.ts                  # TELEFONO, EMAIL, DIRECCION, redes — UNA sola vez
│   ├── content/                   # content collections (datos, no código)
│   │   ├── especialidades/        # 7 archivos .md/.json (nombre, doctor, procedimientos, foto)
│   │   └── testimonios/           # 5 reseñas
│   ├── assets/img/                # las 26 imágenes como archivos → astro:assets las optimiza
│   ├── components/
│   │   ├── BotonWhatsApp.astro    # reemplaza ~15 copias del enlace wa.me
│   │   ├── TarjetaEspecialidad.astro
│   │   ├── Testimonio.astro
│   │   ├── Header.astro           # nav desktop + móvil en un solo lugar
│   │   ├── Footer.astro
│   │   ├── ModalProcedimientos.tsx   # isla React, <dialog> nativo, focus-trap
│   │   ├── CarruselPortada.tsx        # isla React, con control de pausa (WCAG)
│   │   ├── Particulas.tsx             # isla React (client:visible)
│   │   └── Globo.tsx                  # isla React, cobe como dependencia local
│   ├── layouts/Base.astro         # <head>, SEO, JSON-LD parametrizado
│   └── pages/
│       ├── index.astro
│       ├── 404.astro
│       ├── privacidad.astro       # corrige C3
│       └── especialidades/
│           └── [slug].astro       # página SEO por especialidad (generada de content/)
└── public/
    ├── robots.txt
    └── og-cecp.jpg                # corrige C1
```

Correspondencia directa: cada `<section>` del HTML actual se convierte en un componente; ninguna decisión de diseño se pierde. El CSS artesanal (que está bien hecho visualmente) se traduce a Tailwind manteniendo las variables de color como tokens del theme (`azul: #1B6FAE`, `turquesa: #19B5A5`, etc.).

## 8. Plan de migración por fases

Cada fase deja el sitio **desplegable y funcional**; no hay un "gran salto" con el sitio roto a la mitad.

1. **Fase 0 — Proteger lo que existe (1 h):** `git init`, commit del HTML actual, y aplicar las correcciones obligatorias de §5 sobre el archivo actual (son ediciones puntuales). Deploy. *El sitio actual queda corregido y versionado antes de tocar arquitectura.*
2. **Fase 1 — Esqueleto Astro (0.5 día):** proyecto Astro + Tailwind + TS, layout base con todo el `<head>`/SEO/JSON-LD, extraer las 26 imágenes de base64 a archivos, `config.ts` con los datos de contacto.
3. **Fase 2 — Secciones estáticas (1 día):** Header, Hero, Confianza, Cardiogenética, Especialidades, Horario, Testimonios, Contacto, Footer como componentes `.astro`, alimentados por content collections. Sin JS todavía.
4. **Fase 3 — Islas interactivas (1 día):** modales con `<dialog>`, carrusel con pausa, partículas, globo con `cobe` local. Quitar el secuestro global de clics (I3) y el sonido (I4); el scroll suave queda en CSS puro.
5. **Fase 4 — Verificación y deploy (0.5 día):** Lighthouse móvil antes/después (guardar capturas como evidencia para el autor), prueba de compartir por WhatsApp (OG), deploy a Netlify desde el repo. Documentar el comando de build para el futuro traslado a Hostinger.
6. **Fase 5 — Crecimiento (posterior, opcional):** páginas por especialidad, blog de salud, formulario de contacto con validación.

**Estimación total de la migración (fases 0–4): ~3 días de trabajo efectivo.**

---

## 9. Resultados esperados (para validar después, con números)

| Métrica | Hoy (medido) | Esperado post-migración |
|---|---|---|
| Transferencia primera visita (móvil) | 747 KB en 1 petición bloqueante | ~80–120 KB críticos + imágenes lazy reales |
| Tiempo hasta ver contenido (móvil 4G) | ~4–5 s (descarga + loader de 3 s) | **< 1.5 s** |
| Visita repetida | vuelve a validar/bajar el blob completo | HTML ~25 KB; imágenes y CSS desde caché |
| Cambiar el nº de WhatsApp | ~15 ediciones manuales | 1 línea |
| Agregar una especialidad | copiar/pegar ~25 líneas + modal + footer | 1 archivo de datos nuevo |
| Posicionar "pediatra Guayaquil" aparte de "cardiólogo Guayaquil" | imposible (una sola URL) | página dedicada por especialidad |
| Vista previa al compartir por WhatsApp | sin imagen (og:image 404) | imagen correcta |

La validación de la fase 4 debe repetir exactamente las mediciones de §3 (peso transferido, Lighthouse móvil) para que el autor vea la comparación con sus propias pruebas.
