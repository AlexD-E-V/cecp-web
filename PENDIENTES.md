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

## 1.b. Horario de la ficha de Google Maps

- **El horario válido es el de la web** (`HORARIO` en `src/config.ts`), aprobado por el
  titular del centro: consultorio de lunes a viernes 7:00–16:00, más atención con cita
  previa 24/7, domicilio, emergencias 24/7 y convenios de internación.
- La web y sus datos estructurados ya dicen exactamente eso. **Falta comprobar qué horario
  muestra la ficha de Google Maps**, porque es la ficha —no la web— la que decide el
  "Abierto / Cerrado" que ve la gente al buscar. Si no coinciden, gana la ficha.
- **Acción:** revisar el horario publicado en la ficha y, si difiere, corregirlo. Requiere
  acceso de administrador, que hoy no se tiene (ver punto 1). Va junto con esa gestión.
- Nota: en la ficha conviene declarar como horario de apertura **solo el de consultorio**
  (L–V 7:00–16:00) y usar los campos de descripción/servicios para la atención con cita
  previa y las emergencias. Declararla "Abierta 24 horas" haría que alguien se presente en
  la puerta de madrugada esperando encontrar personal.

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
