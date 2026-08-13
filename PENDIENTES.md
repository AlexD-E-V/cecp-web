# Pendientes — cecp-web

> Última revisión: **2026-08-05**.

Puntos abiertos que **no dependen del código**, sino de una decisión o un trámite con
el doctor / la clínica. Se resuelven fuera del repo, pero se anotan aquí para no
perderlos de vista.

Todo lo que era trabajo de código ya está hecho: analítica encendida con consentimiento
revocable, horario y datos estructurados unificados, coordenadas corregidas, páginas
legales publicadas e indexables.

---

## 1. Cuenta de Google oficial de la clínica

**Este punto estaba contradictorio entre documentos. Queda resuelto así.**

### Estado real hoy

La cuenta que **hoy posee** Google Analytics y Search Console es
**`cecptech@gmail.com`**, una cuenta técnica del desarrollador. Es provisional: sirvió
para poder encender la medición sin quedar bloqueados, y funciona bien para eso.

### Qué decía cada documento (y por qué se contradecían)

- El 9 de julio se decidió crear la cuenta oficial con un correo gratuito
  `@cecponline.com` de Hostinger.
- Esa decisión **fue superada por los hechos**: para avanzar con GA4 se usó la cuenta
  técnica. Lo registrado el 21 de julio (`cecptech@gmail.com`) es lo vigente.

### La decisión de julio necesita un matiz importante

El correo del dominio en Hostinger **es gratis solo el primer año**; desde el segundo se
renueva con pago. Si la cuenta de Google que posee TODO se crea con una dirección
`@cecponline.com` y algún día se deja de pagar ese buzón, la cuenta se queda **sin
dirección de recuperación**: se puede seguir entrando con la contraseña, pero si se
pierde, recuperarla se vuelve muy difícil. Atar la propiedad de Analytics, Search Console
y Business Profile a un buzón con renovación anual es un riesgo innecesario.

### Opciones

| | Cómo | Costo | Riesgo |
|---|---|---|---|
| **A** | Cuenta de Google creada con `admin@cecponline.com` | Pago anual del buzón, para siempre | Si dejan de pagarlo, se compromete la recuperación |
| **B** *(recomendada)* | Cuenta de Google nueva y gratuita a nombre de la clínica; el `@cecponline.com` se usa solo como correo de contacto público | Gratis | Ninguno relevante |

**Recomendación: opción B.** Una cuenta de Google **no** tiene que ser de pago ni requiere
Google Workspace. Con una cuenta gratuita a nombre de la clínica se poseen Search Console,
Analytics, Ads y Business Profile.

### Acciones

- [ ] Que la clínica cree su cuenta oficial (opción B salvo que decidan lo contrario).
- [ ] Transferir la propiedad de GA4 y Search Console de `cecptech@gmail.com` a esa cuenta.
- [ ] El desarrollador queda como **administrador delegado, no dueño**.

> **Regla que no se debe romper:** la verificación (DNS TXT, GA, Ads) ata la propiedad a
> la cuenta que la inicia. Si se usa el Gmail personal de un colaborador, la clínica pierde
> el control cuando esa persona se va. Colaboradores = usuarios delegados, nunca dueños.

---

## 2. Propiedad de la ficha de Google Business / Google Maps

- La clínica **ya tiene** ficha (CID `0x5771bcfa1d5c2389`, el mismo del enlace de reseñas
  en `src/config.ts`). **No crear una nueva:** Google penaliza los duplicados.
- **La ficha ya está reclamada, verificada y gestionada activamente por alguien.** Señales:
  hay "Respuesta del propietario" en reseñas recientes (solo posible desde un perfil
  verificado) y `cecponline.com` ya figura como sitio web del negocio. No está libre.
- **Acción:** preguntar al doctor **quién la gestiona** (¿él?, ¿alguien de su equipo?,
  ¿una agencia?). Para obtener acceso, esa persona debe agregar a la cuenta oficial como
  administrador, o aprobar la solicitud de acceso que le llega como notificación.
- **Decisión de negocio:** si ya hay alguien encargándose de la ficha y las reseñas, el
  servicio "Apoyo con ficha de Google Business y reseñas" del plan de mantenimiento **ya
  lo hace otro** → no cobrarlo ni duplicarlo; coordinar o sacarlo del plan.

## 2.b. Horario publicado en la ficha de Maps

- **El horario válido es el de la web** (`HORARIO` en `src/config.ts`), aprobado por el
  titular: consultorio de lunes a viernes 7:00–16:00, más atención con cita previa 24/7,
  domicilio, emergencias 24/7 y convenios de internación.
- La web y sus datos estructurados ya dicen exactamente eso. **Falta comprobar qué horario
  muestra la ficha**, porque es la ficha —no la web— la que decide el "Abierto / Cerrado"
  que ve la gente al buscar. Si no coinciden, gana la ficha.
- **Acción:** revisar y, si difiere, corregir. Requiere el acceso de administrador del
  punto 2, así que va junto con esa gestión.
- **Cómo declararlo:** en la ficha, como horario de apertura va **solo el de consultorio**
  (L–V 7:00–16:00). La atención con cita previa y las emergencias van en los campos de
  descripción y servicios. Marcarla "Abierta 24 horas" haría que alguien se presente en la
  puerta de madrugada esperando encontrar personal.

---

## 3. Email profesional del dominio (Hostinger)

- El correo del dominio es **gratis solo el primer año**; desde el segundo se renueva con
  pago anual.
- **Acción:** avisar al doctor **antes** de que le llegue como sorpresa, para que decida si
  lo mantiene (con costo) o se queda con otra opción.
- Ver el punto 1: esta caducidad es justamente la razón para **no** basar la cuenta de
  Google oficial en una dirección `@cecponline.com`.

---

## 4. Revisión legal final de los textos

- `privacidad.astro` y `terminos.astro` están **publicados, indexables y en el sitemap**
  desde el 2026-08-05, con fecha de última actualización visible en cada uno.
- La política de privacidad ya refleja el estado real del sitio: analítica con
  consentimiento previo, sin cookies publicitarias, y **derecho a retirar el consentimiento
  en cualquier momento** (con el botón que lo hace efectivo).
- **Acción:** que un **profesional legal** los valide. No bloquea nada, pero conviene
  cerrarlo (datos de salud = datos sensibles bajo la LOPDP de Ecuador).
- **Al aplicar sus correcciones:** editar el texto y **actualizar la constante
  `ACTUALIZADO_ISO` / `ACTUALIZADO_TXT`** en cada página. El sitemap se regenera solo en el
  build; no hay que tocarlo salvo que cambie la URL de la página.

---

## 5. Redacción de "Emergencias médicas · 24/7"

- **Entendido hoy:** las emergencias se **coordinan por WhatsApp**; el equipo no permanece
  en el consultorio las 24 horas. Con ese criterio se configuraron la web y sus datos
  estructurados (solo el horario de consultorio se declara como apertura al público).
- **Acción 1 — confirmar con el médico** que ese entendido es correcto. Si resultara que sí
  hay guardia presencial en algún tramo, hay que declararlo como horario de apertura en
  `HORARIO.consultorio` (`src/config.ts`) y en la ficha de Google.
- **Acción 2 — preguntar si quieren explicitarlo en la página.** Hoy la fila "Emergencias
  médicas · 24/7" es la única de las cuatro que no dice "con cita previa", y un paciente
  podría leerla como que puede presentarse en el consultorio a las 3 a.m. Bastaría con
  añadir "· Coordinadas por WhatsApp" a esa fila. **Es decisión de ellos**, no se toca sin
  su visto bueno.
- Riesgo si no se aclara: alguien con una urgencia real llega a una puerta cerrada de
  madrugada. Es un problema de expectativas, no de código.

---

## 6. ¿Se enlaza el TikTok en la página?

- La cuenta **`@cecp_plus`** está en `REDES` (`src/config.ts`) y se declara a Google en
  el `sameAs` del JSON-LD, pero **no se enlaza en ninguna parte visible**: ni en el pie
  ni en la sección de Contacto, que solo muestran Facebook, Instagram, correo y teléfono.
- **Acción: preguntar al doctor si quiere sumar TikTok a la web.**
  - Si **sí** → añadir el icono en `Footer.astro` y en `Contacto.astro`, junto a los otros.
  - Si **no** (p. ej. la cuenta está inactiva o no la quieren asociar al centro) → quitar
    `tiktok` de `REDES` y del `sameAs`, para no declararle a Google un perfil que no se
    reconoce como propio.
- No se tocó nada a la espera de esa respuesta. Hoy la única inconsistencia es que Google
  conoce el perfil y los pacientes no.

## 7. Marketing: medir antes de gastar

Secuencia recomendada, y el orden importa:

1. **Search Console** — verificar `cecponline.com` por DNS desde la cuenta oficial y
   enviar `https://cecponline.com/sitemap-index.xml`.
2. **Google Business Profile** — resolver el acceso (punto 2). Máximo retorno local para
   una clínica en Guayaquil, y es gratis.
3. **Leer los datos** que ya está recogiendo GA4: de dónde llega la gente, qué
   especialidades generan más contactos, dónde abandonan. Las conversiones de WhatsApp y
   llamada ya están instrumentadas (`Base.astro`).
4. **Recién entonces, Google Ads** — con plan y presupuesto definidos, y sobre evidencia
   real. Hay código de conversión de Ads listo para el ID cuando llegue el momento.

> El sitio no usa cookies publicitarias y `ad_storage` está denegado siempre. Si algún día
> se hace Ads, hay que revisar el aviso de cookies y la política de privacidad **antes** de
> encenderlo.

---

## Resumen para hablarlo con el doctor

Los mismos siete puntos de arriba, en una línea cada uno y sin tecnicismos. Sirve
para llevar la conversación sin abrir el documento entero. **Ninguno depende del
código: los siete se resuelven hablando.**

1. **Cuenta de Google de la clínica.** Hoy Analytics y Search Console cuelgan de una
   cuenta técnica del desarrollador. Deberían ser de la clínica, con el desarrollador
   como administrador.
2. **Acceso a la ficha de Google Maps.** Ya existe y alguien la gestiona — hay que
   averiguar quién y pedirle acceso. Incluye revisar que el horario de la ficha
   coincida con el de la web: **manda la ficha, no la web.**
3. **El correo del dominio es gratis solo el primer año.** Avisar antes de que llegue
   el cobro de sorpresa.
4. **Revisión legal** de privacidad y términos por un abogado (datos de salud = datos
   sensibles bajo la LOPDP).
5. **"Emergencias 24/7".** Confirmar que se coordinan por WhatsApp, y decidir si se
   aclara en la web para que nadie se presente en la puerta de madrugada.
6. **¿Se enlaza el TikTok?** Google ya conoce la cuenta, pero en la web no aparece por
   ningún lado. O se pone, o se quita de los datos declarados.
7. **Marketing, en este orden:** Search Console → ficha de Google → leer lo que GA4 ya
   está midiendo → y recién entonces, si acaso, Google Ads.

### Sobre las reseñas nuevas de Google

Las reseñas individuales **no hay que hacer nada con ellas**: no se copian a la web
salvo que aporten algo que las cinco de `src/data/testimonios.ts` no digan ya. Lo
único que sí envejece y hay que mantener es el **contador de la insignia**
(`RESENAS` en `src/config.ts`), y para eso no sirven las reseñas sueltas: hace falta
el total que aparece arriba de la ficha, junto a la valoración global.

Criterio para decidir si una reseña merece subir a la web: que sea concreta (mencione
un procedimiento, un equipo, un profesional) y que el nombre de quien la firma no
haga dudar de su autenticidad. Una reseña genérica o firmada con un alias comercial
resta credibilidad al bloque de testimonios, aunque en Google sume.
