# Pendientes — cecp-web

Puntos abiertos que **no dependen del código**, sino de una decisión o un trámite
con el doctor / la clínica. Se resuelven fuera del repo, pero se anotan aquí para
no perderlos de vista.

## 1. Propiedad de la ficha de Google Business / Google Maps

- La clínica **ya tiene** ficha en Google Maps (hay enlace de reseñas `g.page/r/...`
  en `src/config.ts`). **No crear una nueva** (Google penaliza duplicados).
- **HALLAZGO (jul 2026):** la ficha **ya está reclamada, verificada y gestionada
  activamente por alguien**. Señales: hay **"Respuesta del propietario"** en reseñas
  recientes (solo posible con un perfil de Google Business verificado) y el sitio web
  `cecponline.com` ya está puesto en el negocio. O sea, NO está libre para reclamar.
- **Acción:** preguntar al doctor **quién gestiona la ficha** (¿él?, ¿alguien de su
  equipo?, ¿una agencia/persona de marketing?). Para obtener acceso, ese gestor debe
  **agregar a `cecptech@gmail.com` como administrador/propietario** (o aprobar una
  solicitud de acceso, que le llega como notificación).
- **Decisión de negocio:** si ya hay alguien encargándose de la ficha y las reseñas,
  el servicio "Apoyo con ficha de Google Business y reseñas" del plan de mantenimiento
  **ya lo hace otro** → no cobrarlo ni duplicarlo; coordinar o sacarlo del plan.

## 2. Email profesional del dominio (Hostinger)

- El correo del dominio es **gratis solo el primer año**; a partir del segundo año se
  **renueva con pago anual**.
- **Acción:** avisar al doctor de esto **antes** de que le llegue como sorpresa, para
  que decida si mantiene el correo del dominio (con costo) o se queda con otra opción.
- Mientras tanto, la cuenta de Google usada para GA4 / Search Console / Business es la
  provisional-técnica `cecptech@gmail.com`. A futuro, lo ideal es que la clínica tenga
  su **propia cuenta de Google** como dueña de todo (el desarrollador con acceso de
  administrador).

## 3. Revisión legal final de los textos

- `privacidad.astro` y `terminos.astro` ya están **publicables** (versión final de
  trabajo, redacción informativa sobre los servicios, no sobre el acto médico).
- **Acción:** que un **profesional legal** los valide en los próximos días. No bloquea
  la publicación, pero conviene dejarlo cerrado (datos de salud = sensibles bajo la
  LOPDP de Ecuador).

## 4. Encender la analítica (cuando exista el ID de GA4)

- El código ya está listo: banner de cookies + Consent Mode montados.
- **Acción:** pegar el **ID de medición** (`G-XXXXXXXXXX`) en `GA_ID` dentro de
  `src/config.ts`. Con eso se activan la analítica (solo si el visitante acepta) y el
  aviso de cookies.
