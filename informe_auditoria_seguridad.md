# Informe de auditoría de seguridad — Bosquejo

## Estado de remediación — 13 de septiembre de 2026

Se aplicó una remediación integral al frontend, backend y despliegue Docker. El riesgo actual baja de **crítico** a **medio condicionado**: los defectos explotables desde la aplicación fueron corregidos y verificados, pero quedan dos acciones que dependen de infraestructura externa y una migración de datos históricos. Este apartado prevalece sobre las descripciones originales, que se conservan como evidencia del estado anterior.

| ID | Estado | Corrección aplicada / acción pendiente |
|---|---|---|
| H01 | Corregida | Denegación por defecto; catálogo público explícito; API operativa limitada a administrador/empleado; portal limitado al usuario autenticado; `/api/me` exige sesión real. |
| H02 | Corregida | El registro público ignora cualquier rol solicitado y asigna exclusivamente el rol cliente. |
| H03 | Código corregido; acción externa pendiente | Se retiraron credenciales del código y se creó configuración ignorada por Git con secretos aleatorios para JWT y PostgreSQL. Deben rotarse en R2, Gmail, Google, Tripo3D y n8n las claves que ya estuvieron expuestas, y depurarse del historial Git si el repositorio salió del equipo. |
| H04 | Corregida | Los JWT declaran tipo `access` o `2fa_pending`; el filtro acepta únicamente `access`. Para desactivar 2FA se exige un OTP vigente y cada alta genera un secreto nuevo. |
| H05 | Corregida | Los mensajes dinámicos usan texto o escape HTML antes de llegar a SweetAlert. |
| H06 | Corregida | Se eliminó el cliente S3 y sus variables del frontend; las referencias IA se cargan mediante un endpoint autenticado del backend. |
| H07 | Corregida | Los campos de contraseña, token y secretos 2FA se redactan; `/api/logs` exige administrador. |
| H08 | Corregida | Favoritos, perfil, compras y evidencia derivan la identidad del principal autenticado; se comprueba pertenencia en las lecturas del portal. |
| H09 | Corregida | Precio y total se calculan desde la base de datos, cantidades y stock se validan, las filas de muebles se bloquean y el pago queda pendiente de confirmación. |
| H10 | Corregida para el despliegue actual | Cada petición comprueba que la cuenta siga activa y que rol y huella de credenciales sigan vigentes. Logout revoca el JWT en la instancia; cambiar la contraseña invalida todos los JWT anteriores. |
| H11 | Corregida | Se eliminó el JWT de URLs y respuestas del chatbot; el backend ya no acepta `token` por query ni reenvía el bearer a n8n. |
| H12 | Corregida | La sesión ya no se entrega a JavaScript ni se guarda en `localStorage`: se envía en cookie `HttpOnly`, `SameSite=Strict` y `Secure` al habilitar `APP_AUTH_COOKIE_SECURE=true`. Las mutaciones usan token CSRF. |
| H12 | Corregida | Google exige email verificado y guarda el `sub` estable y único. Una cuenta local no se vincula automáticamente por coincidencia de correo. |
| H13 | Corregida | Chat e IA exigen autenticación, tienen límite de solicitudes, cola acotada, dos trabajadores y límites de tiempo/tamaño. |
| H14 | Corregida para archivos nuevos; migración pendiente | Se comprueba tamaño, extensión y firma mágica. Las rutas locales se normalizan y deben permanecer dentro de `storage`. Las evidencias nuevas usan almacenamiento local protegido. Deben retirarse o migrarse documentos históricos que ya estén publicados en R2. |
| H15 | Corregida | Registro y restablecimiento exigen contraseñas de 12 a 72 caracteres en el servidor. |
| H16 | Corregida para una instancia | Login, 2FA, registro, recuperación, chat e IA tienen rate limiting por IP. Si se escala a varias réplicas, el contador debe trasladarse a Redis u otro almacén compartido. |
| H17 | Corregida | Páginas limitadas a 100 registros, parámetros acotados, multipart a 20/25 MB, máximo 20 partes, conexiones y descarga de modelos limitadas. |
| H18 | Corregida | Las respuestas 500 usan referencia opaca; la excepción completa queda solo en logs y se desactivó el logging de depuración. |
| H19 | Acción de infraestructura pendiente | Nginx añade CSP y cabeceras defensivas y centraliza `/api`; Docker aún sirve HTTP local. Para publicación se debe terminar TLS con certificado y dominio en el proxy perimetral. |
| H20 | Corregida | PostgreSQL se enlaza solo a `127.0.0.1`; el backend ya no publica puerto al host y se consume a través de Nginx. |
| H21 | Corregida | Un trabajo idempotente crea `bosquejo_app` sin superusuario, `CREATEDB` ni `CREATEROLE`; el backend usa esa cuenta. |

### Verificación posterior

- `mvnw.cmd -B -ntp test`: correcto con Spring Boot 4.1.1, Spring Security 7.1.1 y Tomcat 11.0.24.
- `npx vite build`: artefacto de producción generado correctamente.
- `npm audit --audit-level=low`: **0 vulnerabilidades**. Se eliminaron `xlsx` y `swiper`; la exportación CSV neutraliza fórmulas.
- `docker compose config --quiet`: correcto.
- `docker compose up -d --build`: imágenes de backend y frontend construidas; servicios ejecutados como usuario sin privilegios.
- Pruebas HTTP sin token: `/` y el catálogo responden; `/api/usuarios` y `/api/me` rechazan el acceso.
- PostgreSQL: `bosquejo_app` devuelve `rolsuper=false`, `rolcreatedb=false` y `rolcreaterole=false`.
- SQL injection: se revisaron JPQL, consultas nativas, `JdbcTemplate` y filtros del dashboard. Los valores externos se enlazan mediante parámetros; no se encontró una vía de inyección SQL explotable.
- Reconstrucción final Docker completada. Pruebas HTTP posteriores: `/` → 200, `/api/muebles` → 200, `/api/usuarios` → 401 y `/api/me` → 401. Backend, frontend y PostgreSQL permanecen activos; `db-init` finaliza correctamente después de aplicar los privilegios.

### Configuración requerida después de rotar claves

El archivo local `runtime-secrets.env` está excluido de Git. Complete ahí las credenciales **nuevas** de correo, Google, R2, Tripo3D y n8n. Las integraciones correspondientes permanecen deshabilitadas mientras esos valores estén vacíos; el resto del sistema puede iniciar sin recuperar secretos expuestos.

Fecha: 11 de septiembre de 2026. Código base: `e1efc69`, incluyendo los cambios locales existentes al comenzar la revisión.

**Evaluación general: riesgo crítico.** La API permite operaciones administrativas sin autenticación, el registro público permite seleccionar un rol privilegiado y existen secretos en archivos versionados. El segundo factor, las compras y varios flujos del navegador presentan problemas adicionales.

## Alcance, método y límites

Se siguieron las instrucciones de [pruebas_seguridad.md](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/pruebas_seguridad.md). Se revisaron los flujos de autenticación, autorización, usuarios, roles, permisos, compras, archivos, auditoría, chat, generación IA, consultas, frontend y configuración Docker de [frontend](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend) y [backend](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend). `old_backend` no forma parte de los servicios definidos en Compose y queda fuera del alcance.

Se realizó análisis estático de código/configuración, seguimiento de datos entre componentes, inspección del lockfile y del BOM Maven disponible localmente, consulta de avisos oficiales y `npm audit --json --package-lock-only --ignore-scripts`. No se modificó código, configuración, dependencias ni datos. Solo se creó este informe. No se ejecutó `audit fix`, compilación, migración ni prueba de carga.

La consulta autorizada `docker compose ps -a --format json` encontró los tres servicios **detenidos**: PostgreSQL y frontend con salida 0, backend con salida 137. Este último código no permite determinar por sí solo la causa. No se levantaron servicios, entre otras razones porque el backend tiene `ddl-auto=update` y arrancarlo podría modificar el esquema.

Por tanto, **los hallazgos se confirman en código/configuración, salvo las condiciones expresamente indicadas; no representan exploits HTTP ejecutados contra los contenedores**. No se comprobaron el firewall real, privilegios actuales del volumen PostgreSQL, vigencia/alcance de claves externas, contenido de bases de datos ni imágenes Docker publicadas. No se contactó R2, SMTP, Google, Tripo3D ni n8n con credenciales del proyecto.

Los secretos se omiten deliberadamente. La consulta a npm utilizó metadatos de dependencias, no archivos de credenciales. La única reproducción local de comportamiento ejecutó la función de formato del chat con un token ficticio, sin red.

Las categorías corresponden a [OWASP Top 10:2025](https://owasp.org/Top10/2025/0x00_2025-Introduction/). La severidad considera el impacto creíble cuando la aplicación se ejecute y sea accesible; no implica que exista exposición pública a Internet. Se separan hallazgos del código, avisos de dependencias y recomendaciones preventivas.

## Arquitectura observada

```text
Navegador del usuario
  ├─ HTTP localhost:80 → Docker frontend → Nginx → archivos React/Vite
  ├─ HTTP localhost:8080 → Docker backend → Spring Boot / JWT
  │                                          ├─ db:5432 → PostgreSQL
  │                                          ├─ Cloudflare R2
  │                                          ├─ Google / SMTP
  │                                          ├─ Tripo3D
  │                                          └─ n8n (recibe también el JWT)
  └─ R2 directamente desde el módulo de generación IA

Puerto publicado de PostgreSQL en el equipo: 5433 → contenedor:5432
```

React se ejecuta en el navegador, aunque Nginx lo distribuya desde un contenedor. `localhost` en JavaScript designa el equipo del usuario; `db` es un nombre interno de Docker, accesible desde el backend. Nginx no actúa actualmente como proxy de `/api`.

Evidencia: [compose.yml:20](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/compose.yml:20), [nginx.conf:1](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/nginx.conf:1), [axios.ts:4](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/api/axios.ts:4) y [r2Service.ts:3](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/services/r2Service.ts:3).

## Inventario de hallazgos

| ID | Severidad | Problema |
|---|---|---|
| H01 | Crítica | API administrativa abierta y validación ficticia de sesión |
| H02 | Crítica | Registro público con selección de rol privilegiado |
| H03 | Crítica | Clave JWT y otros secretos incluidos en archivos versionados |
| H04 | Alta | Token pendiente de 2FA aceptado como sesión autenticada |
| H05 | Alta | XSS almacenado mediante interpolación en SweetAlert |
| H06 | Alta | Credenciales R2 destinadas al navegador |
| H07 | Crítica | Registro de secretos en la auditoría accesible desde la API |
| H08 | Alta | Identidad y pertenencia de recursos controladas por el cliente |
| H09 | Alta | Manipulación de precios, cantidades y registro de pagos |
| H10 | Alta | Cuentas deshabilitadas y sesiones revocadas siguen siendo utilizables |
| H11 | Alta | Inserción de JWT en imágenes/enlaces de cualquier dominio |
| H12 | Alta | Vinculación automática con Google basada únicamente en email |
| H13 | Alta | Generación IA sin cuotas ni control de concurrencia |
| H14 | Alta | Archivos sin validación suficiente y documentos con URL pública |
| H15 | Media | Restablecimiento de contraseña sin política en servidor |
| H16 | Media | Autenticación y recuperación sin límite de intentos |
| H17 | Media | Paginación y límites de solicitudes permiten consumo excesivo |
| H18 | Media | Exposición de mensajes internos y configuración de depuración |
| H19 | Media | Despliegue definido sin HTTPS |
| H20 | Media | Publicación amplia de PostgreSQL y del backend |
| H21 | Media | Credenciales de inicialización de PostgreSQL usadas por la aplicación |

H01 describe el control general ausente. H02 y H08 se mantienen separados porque requieren cambios en el registro y en la autorización por objeto incluso después de cerrar el acceso general. Los impactos encadenados no se suman como incidentes independientes.

---

# Vulnerabilidad: H01 — API administrativa abierta y validación ficticia de sesión

## Severidad

Crítica. Confirmada por análisis estático.

## Categoría OWASP

A01:2025 — Broken Access Control.

## Ubicación

[SecurityConfig.java:30](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/SecurityConfig.java:30), [UsuarioController.java:132](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/UsuarioController.java:132), [RolPermisoController.java:79](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/RolPermisoController.java:79), [AuthController.java:101](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/AuthController.java:101), [ProtectedRoute.tsx:11](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/components/ProtectedRoute.tsx:11).

## Descripción

Las reglas terminan con `requestMatchers("/api/**").permitAll()` y `anyRequest().permitAll()`. Los controladores administrativos revisados no compensan esto con autorización. No se encontraron `@EnableMethodSecurity`, `@PreAuthorize`, `@Secured` ni un interceptor alternativo de permisos. El filtro JWT continúa la cadena si falta el token o resulta inválido.

Además, `/api/me` responde siempre `{"valid":true}`. El guard utilizado por las rutas del frontend interpreta cualquier respuesta exitosa como sesión válida. Los permisos en React no protegen solicitudes directas a la API.

## Impacto

Lectura de usuarios y perfiles con datos personales; creación, modificación o eliminación de recursos administrativos; modificación de roles/permisos y acceso a reportes. No se requiere romper la firma JWT para los endpoints abiertos.

## Evidencia

`SecurityConfig` líneas 45–53 permite usuarios, permisos, reportes y el resto de `/api`. `UsuarioController.update` admite nombre, email, estado y rol por ID sin identificar al solicitante. `RolPermisoController.sincronizar`, líneas 148–162, borra y reinserta permisos del rol indicado.

**Excepciones observadas:** `GET /api/backup` exige `ROLE_ADMIN`; varias rutas del portal y de 2FA sí comprueban un principal manualmente. No se afirma que todos los endpoints se comporten igual.

## Recomendación

Denegar por defecto, permitir únicamente rutas públicas explícitas y aplicar permisos por operación en backend. Hacer que `/api/me` valide una autenticación completa. Comprobar 401 sin credenciales, 401 con JWT inválido y 403 con rol insuficiente, incluyendo solicitudes directas fuera del frontend.

---

# Vulnerabilidad: H02 — Registro público con selección de rol privilegiado

## Severidad

Crítica. Flujo confirmado; la asignación exige que el rol solicitado exista en la base de datos.

## Categoría OWASP

A01:2025 — Broken Access Control.

## Ubicación

[AuthController.java:89](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/AuthController.java:89), [RegisterService.java:21](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/RegisterService.java:21), [UsuarioMapper.java:26](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/persistence/mapper/UsuarioMapper.java:26), [JwtAuthFilter.java:44](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/JwtAuthFilter.java:44).

## Descripción

El registro público recibe `idRol` y lo transfiere al servicio. Este asigna `nuevo.setIdRol(idRol)` sin restringirlo al rol de cliente. El mapper convierte ese ID en la relación persistente con `RolEntity`.

## Impacto

Un visitante puede solicitar el rol administrativo durante el registro. Después del login se incluirá ese rol en su JWT; el filtro interpreta `id_rol=1` como `ROLE_ADMIN`. Esto también amenaza rutas restringidas como backup si la operación de copia está disponible.

## Evidencia

`AuthController` línea 92 pasa el rol del request; `RegisterService` línea 35 lo conserva. El servidor no fija un rol mínimo. No se creó ninguna cuenta durante la revisión.

## Recomendación

Eliminar el rol del DTO público y asignar en servidor un rol de cliente conocido. Reservar la asignación de privilegios a un endpoint administrativo con autenticación, permiso explícito y auditoría sin secretos.

---

# Vulnerabilidad: H03 — Clave JWT y otros secretos incluidos en archivos versionados

## Severidad

Crítica por la clave de firma JWT configurada. La vigencia de las credenciales de terceros no se probó.

## Categoría OWASP

A04:2025 — Cryptographic Failures; A02:2025 — Security Misconfiguration.

## Ubicación

[application.properties:26](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/resources/application.properties:26), [JwtUtil.java:22](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/JwtUtil.java:22), [backend/Dockerfile:6](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/Dockerfile:6), [compose.yml:24](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/compose.yml:24).

## Descripción

El archivo de propiedades contiene valores literales de firma JWT, contraseña SMTP y credenciales de R2/Tripo3D, además de credenciales de base de datos. `git ls-files` confirma que ese archivo está versionado. La construcción incorpora `src` al JAR y este pasa a la imagen final. `JwtUtil` incluye también una clave predeterminada literal.

Compose sustituye las credenciales de base de datos, pero no define una sustitución de `jwt.secret`, SMTP, R2 o Tripo3D. Por tanto, el despliegue descrito hereda esos valores del recurso del backend, salvo una configuración externa adicional no observada.

## Impacto

Quien obtenga la clave de firma desde el repositorio o artefacto puede fabricar tokens con otra identidad y rol. Otros secretos podrían permitir abuso de correo, almacenamiento o servicios facturados, según su vigencia y permisos.

## Evidencia

Valores literales no vacíos: propiedades 26, 33, 72–73 y 79. La firma y validación usan la misma clave en `JwtUtil` líneas 26–28, 48 y 90–93. No se reproducen los valores ni se emitieron tokens falsos.

## Recomendación

Rotar las claves expuestas, retirar los literales y eliminar los valores predeterminados inseguros. Inyectar secretos desde el entorno o un gestor de secretos, separarlos por ambiente y hacer fallar el arranque si faltan. Invalidar JWT firmados con la clave anterior. Revisar acceso e historial del repositorio y artefactos; borrar el literal del último commit no revoca una clave.

---

# Vulnerabilidad: H04 — Token pendiente de 2FA aceptado como sesión autenticada

## Severidad

Alta. Confirmada por seguimiento de emisión, filtro y endpoints 2FA.

## Categoría OWASP

A07:2025 — Authentication Failures.

## Ubicación

[JwtUtil.java:53](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/JwtUtil.java:53), [JwtAuthFilter.java:41](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/JwtAuthFilter.java:41), [TwoFactorAuthController.java:40](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/TwoFactorAuthController.java:40), [TwoFactorAuthServiceImpl.java:28](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/TwoFactorAuthServiceImpl.java:28).

## Descripción

Tras comprobar solo la contraseña, el login emite un JWT de cinco minutos con `is_2fa_pending=true`. El filtro únicamente valida firma/expiración, toma el subject y crea un principal autenticado. Al faltar `id_rol`, lo trata como `ROLE_USER` en vez de rechazarlo para recursos protegidos.

`/api/2fa/generate` devuelve el secreto existente aunque 2FA ya esté habilitado. `/api/2fa/disable` solo exige obtener un ID del principal y no solicita OTP ni contraseña.

## Impacto

Con la contraseña, pero sin el segundo factor, se puede presentar el token temporal como Bearer para obtener el secreto 2FA o deshabilitarlo. También satisface controles manuales del portal que solo requieren un principal numérico.

## Evidencia

El filtro no inspecciona `is_2fa_pending`. El servicio reutiliza el secreto en líneas 32–42 y lo borra/deshabilita en 66–73. `LoginService.verify2fa` tampoco exige explícitamente un token de propósito 2FA.

## Recomendación

Separar los tokens temporales de los de acceso, validar su propósito y no crear una sesión completa con ellos. Restringirlos al intercambio 2FA, hacerlos de un solo uso y exigir autenticación reciente más OTP para recuperar/reemplazar o desactivar el factor. No volver a devolver el secreto ya enrolado.

---

# Vulnerabilidad: H05 — XSS almacenado mediante interpolación en SweetAlert

## Severidad

Alta. Flujo fuente–persistencia–HTML confirmado; no se ejecutó JavaScript malicioso en el navegador.

## Categoría OWASP

A05:2025 — Injection.

## Ubicación

[AgregarModal.tsx:625](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/components/ui/modal/mueble_material/AgregarModal.tsx:625), [ModalProduccionDetalle.tsx:218](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/components/ui/modal/negocio/ModalProduccionDetalle.tsx:218), [MuebleController.java:80](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/MuebleController.java:80), [MuebleService.java:46](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/MuebleService.java:46).

## Descripción

Se interpolan `selectedMueble.nom_mue` y `etapaNombre` dentro de la opción `html` de SweetAlert. El nombre del mueble llega desde la API y puede guardarse sin codificación específica para ese contexto. La opción `html` interpreta el valor como marcado; en la implementación local de SweetAlert se usa `DOMParser` y se insertan nodos sin eliminar atributos de eventos.

## Impacto

Un nombre preparado puede ejecutar código cuando otro usuario abra el diálogo correspondiente. El código se ejecutaría en el origen del frontend, donde el JWT está en `localStorage`, y podría leerlo o actuar como la víctima. H01 facilita introducir el contenido sin una cuenta privilegiada.

## Evidencia

`html: ... <b>${selectedMueble.nom_mue}</b>` en línea 628; `${etapaNombre}` dentro del HTML en línea 227. El uso habitual de JSX escapado en otras pantallas no protege estas interpolaciones.

## Recomendación

Usar `text` para datos del usuario o construir nodos con `textContent`/componentes seguros. Si se necesita HTML, sanitizar con una lista permitida adecuada. Añadir CSP como defensa adicional y revisar todos los usos de `html`, sin confiar en validación del formulario.

---

# Vulnerabilidad: H06 — Credenciales R2 destinadas al navegador

## Severidad

Alta. Confirmada en código y configuración de compilación; no confirmada en la imagen Docker desplegada.

## Categoría OWASP

A02:2025 — Security Misconfiguration; A04:2025 — Cryptographic Failures.

## Ubicación

[frontend/.env:2](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/.env:2), [r2Service.ts:3](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/services/r2Service.ts:3), [Generar3DModal.tsx:112](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/components/ui/modal/ia/Generar3DModal.tsx:112), [frontend/Dockerfile:6](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/Dockerfile:6), [frontend/.dockerignore:1](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/.dockerignore:1).

## Descripción

El cliente S3 del frontend utiliza `VITE_R2_ACCESS_KEY_ID` y `VITE_R2_SECRET_ACCESS_KEY`. Estas variables contienen valores y el archivo `.env` está versionado. El módulo se importa en el flujo de generación IA. Docker copia el contexto, que no excluye `.env`, antes de compilar.

Las variables `VITE_*` referenciadas se sustituyen durante el build y quedan accesibles al cliente. Es comportamiento documentado por [Vite](https://vite.dev/guide/env-and-mode).

## Impacto

Al distribuir ese build, los visitantes pueden recuperar las credenciales y usar los permisos que concedan fuera de las validaciones de React. El alcance real del bucket y la vigencia de las claves no fueron consultados.

## Evidencia

`S3Client.credentials` toma ambas variables. `uploadFile` envía `PutObjectCommand`. Una comparación local **no encontró los valores actuales en el `frontend/dist` existente**; no se asume que ese artefacto corresponda a este código. Esto limita la afirmación sobre exposición ya desplegada, pero no elimina la inclusión prevista por el build actual ni la exposición en Git.

## Recomendación

Rotar las credenciales y retirar la firma S3 del navegador. Solicitar al backend URLs de subida de corta duración, restringidas a usuario, objeto, tamaño y tipo. Mantener las credenciales permanentes exclusivamente en servidor y revisar los artefactos realmente distribuidos.

---

# Vulnerabilidad: H07 — Secretos copiados a la auditoría accesible desde la API

## Severidad

Crítica por la exposición potencial de tokens de recuperación vigentes. Flujo confirmado en código; no se inspeccionaron registros reales.

## Categoría OWASP

A09:2025 — Security Logging & Alerting Failures; A01:2025 — Broken Access Control.

## Ubicación

[HibernateAuditListener.java:97](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/audit/HibernateAuditListener.java:97), [HibernateListenerConfigurer.java:21](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/audit/HibernateListenerConfigurer.java:21), [AuditLogController.java:25](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/AuditLogController.java:25), [VerificationTokenEntity.java:15](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/persistence/entity/VerificationTokenEntity.java:15).

## Descripción

El listener registrado para inserciones, actualizaciones y eliminaciones copia propiedades de entidades sin excluir contraseñas, secretos TOTP o tokens de recuperación. Serializa estados completos como `oldValues` y `newValues`. `/api/logs` devuelve los registros y cae bajo la regla pública de H01.

## Impacto

Pueden quedar accesibles hashes de contraseñas, semillas 2FA y tokens de recuperación sin caducar, además de datos personales. Un token de recuperación registrado puede servir para sustituir la contraseña de su cuenta antes de expirar. Los valores antiguos pueden conservarse incluso después de cambios de credenciales.

## Evidencia

`extractState` incorpora cada propiedad persistente mediante `map.put(propertyNames[i], state[i])`. `UsuarioEntity` tiene `pasUsu` y `secret2fa`; `VerificationTokenEntity` tiene `token`. El controlador devuelve `resultado.getContent()` sin redacción. No se afirma que todos los eventos históricos se hayan serializado correctamente: el listener también contempla errores de serialización.

## Recomendación

Aplicar una lista explícita de campos auditables y excluir credenciales y tokens, incluidas relaciones anidadas. Restringir la API de auditoría. Revisar y sanear registros existentes con una política de retención; revocar secretos/tokens que hayan quedado expuestos. Registrar que se cambió una contraseña, nunca su valor o hash.

---

# Vulnerabilidad: H08 — Identidad y pertenencia de recursos controladas por el cliente

## Severidad

Alta. Confirmada en código.

## Categoría OWASP

A01:2025 — Broken Access Control.

## Ubicación

[FavoritoController.java:31](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/FavoritoController.java:31), [FavoritoController.java:138](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/FavoritoController.java:138), [ClientePortalController.java:102](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/ClientePortalController.java:102), [ClientePortalController.java:288](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/ClientePortalController.java:288).

## Descripción

Favoritos toma la identidad desde `X-USER-ID`, `filter[id_usu]`, parámetros o cuerpo JSON. Compra directa prioriza `id_cli` del cuerpo y solo busca al cliente autenticado cuando el campo está ausente. No compara la pertenencia del recurso con el principal.

## Impacto

Un solicitante puede consultar o modificar favoritos ajenos y registrar compras para otro cliente. El endpoint `por-usuario/{idUsu}` también permite consultar datos personales del perfil por ID. H01 agrava la situación, pero exigir un JWT sin comprobar pertenencia no la resolvería.

## Evidencia

`idUsu = headerIdUsu != null ? headerIdUsu : filterIdUsu`; `idUsu = payload.get("id_usu")`; en compra directa, líneas 292–299, el ID enviado tiene prioridad. Las consultas SQL sí están parametrizadas: el problema es autorización, no inyección SQL.

## Recomendación

Derivar la identidad del principal validado. Filtrar cada lectura/modificación por propietario y permitir actuar sobre terceros solo con un permiso administrativo explícito. Rechazar o ignorar identificadores de identidad enviados por clientes ordinarios.

---

# Vulnerabilidad: H09 — Manipulación de precios, cantidades y registro de pagos

## Severidad

Alta. Confirmada en la lógica; no se registraron compras de prueba.

## Categoría OWASP

A06:2025 — Insecure Design; A08:2025 — Software or Data Integrity Failures.

## Ubicación

[ClientePortalController.java:318](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/ClientePortalController.java:318).

## Descripción

La compra directa calcula el total con `precio_unitario` recibido. Solo compara `stock < cantidad`, sin exigir cantidades positivas. Después resta la cantidad y crea un `PagoEntity` únicamente a partir del método y los datos de la solicitud, sin evidencia de liquidación o verificación de proveedor en ese flujo.

## Impacto

Alteración de importes, ventas a precio cero/negativo, aumento artificial de stock al enviar cantidades negativas y registros de pago sin acreditación. Por ejemplo, con stock 10 y cantidad -1, la comprobación no rechaza la operación y el cálculo de stock resulta 11. Esto describe la lógica Java; restricciones adicionales de la base de datos no fueron comprobadas.

## Evidencia

Líneas 325–327: total basado en precio del request. Líneas 342–375: persistencia de cantidad/precio y `stockPost = stockAnt - cantidad`. Líneas 385–392: guardado de pago. La venta queda `Pendiente`; no se afirma que el sistema haya confirmado un cobro bancario real.

## Recomendación

Tomar precios vigentes del servidor, validar cantidades enteras positivas y límites, usar `BigDecimal` y reglas de descuentos. Confirmar pagos mediante un flujo separado verificable; diferenciar una intención de pago de un pago acreditado. Hacer atómica la reserva/descuento de stock y protegerla ante concurrencia y solicitudes repetidas.

---

# Vulnerabilidad: H10 — Cuentas deshabilitadas y sesiones revocadas siguen siendo utilizables

## Severidad

Alta. Confirmada en los caminos revisados.

## Categoría OWASP

A07:2025 — Authentication Failures; A01:2025 — Broken Access Control.

## Ubicación

[LoginService.java:42](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/LoginService.java:42), [JwtAuthFilter.java:41](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/JwtAuthFilter.java:41), [AuthController.java:106](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/AuthController.java:106), [PasswordResetService.java:50](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/PasswordResetService.java:50).

## Descripción

El login con contraseña no comprueba `estUsu`; el login de Google sí lo hace. La verificación 2FA tampoco vuelve a comprobarlo. El filtro confía en el rol del token sin comprobar que la cuenta siga activa o que sus privilegios no hayan cambiado. Logout solo devuelve un mensaje y el restablecimiento de contraseña no invalida JWT previos.

## Impacto

Una cuenta deshabilitada puede obtener nuevos tokens con contraseña correcta. Un token emitido previamente puede conservar acceso tras logout, cambio de contraseña o descenso de rol hasta su expiración. La configuración actual es de **una hora**, no las 24 horas sugeridas por el valor predeterminado o la respuesta `expires_in`.

## Evidencia

`LoginService` líneas 43–61 no consulta el estado. `JwtAuthFilter` obtiene el rol del JWT. `application.properties` línea 27 define `3600000` ms. `AuthController.logout` no realiza ninguna revocación.

## Recomendación

Comprobar cuenta activa en todos los métodos de login y al usar sesiones. Incorporar versión de sesión/credenciales o revocación verificable para cambios sensibles. Usar access tokens breves con renovación controlada y mantener consistente el tiempo comunicado al frontend.

---

# Vulnerabilidad: H11 — Inserción de JWT en imágenes y enlaces de cualquier dominio

## Severidad

Alta. Sustitución reproducida localmente con token ficticio; no se transmitió ningún token real.

## Categoría OWASP

A01:2025 — Broken Access Control; A07:2025 — Authentication Failures.

## Ubicación

[ChatbotPage.tsx:38](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/pages/IA/ChatbotPage.tsx:38), [Chatbot.tsx:59](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/components/ui/chatbot/Chatbot.tsx:59), [JwtAuthFilter.java:37](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/JwtAuthFilter.java:37).

## Descripción

`formatMarkdown` sustituye globalmente `token=TU_TOKEN` por el JWT de `localStorage`, sin validar el destino ni limitarse a enlaces del backend. ReactMarkdown permite imágenes HTTPS y se renderiza el texto transformado. Una respuesta del chat que contenga una imagen externa puede incluir el token en su URL y provocar su envío al cargarla, sin necesitar ejecutar JavaScript.

El backend además acepta JWT como parámetro `token`, lo que facilita que credenciales reutilizables aparezcan en historiales, enlaces y registros de peticiones.

## Impacto

Divulgación del token a un dominio controlado por quien consiga influir en el texto renderizado. La posibilidad de inducir esa respuesta en el proveedor IA no se probó; la transformación vulnerable sí. Los enlaces de reportes también exponen el token por usarlo en la URL.

## Evidencia

Se extrajo y ejecutó la función real de `ChatbotPage.tsx` con `localStorage` simulado:

```text
Entrada: ![imagen](https://destino.example.invalid/pixel?token=TU_TOKEN)
Salida:  ![imagen](https://destino.example.invalid/pixel?token=TOKEN_DE_PRUEBA_SIN_VALIDEZ)
```

No hubo peticiones de red. `rel="noopener noreferrer"` en enlaces no elimina un token incluido directamente en la URL ni protege la carga de imágenes.

## Recomendación

Eliminar la interpolación de credenciales en contenido del chat. Descargar reportes con `Authorization` mediante fetch y generar un Blob, o emitir URLs específicas, limitadas y de un solo uso. Aceptar JWT de acceso únicamente por el canal previsto y validar dominios/rutas de recursos generados por IA.

---

# Vulnerabilidad: H12 — Vinculación automática con Google basada únicamente en email

## Severidad

Alta. Defecto de vinculación confirmado; explotación condicionada a una cuenta Google cuyo email no constituya prueba suficiente de identidad de la cuenta local.

## Categoría OWASP

A07:2025 — Authentication Failures.

## Ubicación

[GoogleAuthAdapter.java:25](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/security/google/GoogleAuthAdapter.java:25), [LoginService.java:65](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/LoginService.java:65).

## Descripción

El adaptador verifica criptográficamente el ID token y su audiencia, pero devuelve únicamente email/nombre/foto. El servicio busca una cuenta local por ese email e inicia sesión en ella sin una vinculación previa por `sub`, comprobación de `email_verified`/`hd` o desafío adicional cuando Google no es autoridad sobre el correo.

## Impacto

Una identidad Google no autoritativa para un correo podría asociarse indebidamente a una cuenta local con ese mismo correo. No equivale a poder falsificar cualquier token de Google y no se probó una toma de cuenta real. Las cuentas con 2FA pasan por ese flujo, cuyo problema se describe en H04.

## Evidencia

`GoogleAuthAdapter` líneas 36–41 descarta el identificador estable del proveedor. `LoginService` líneas 69–70 enlaza exclusivamente por email. Google explica que los correos externos a Gmail/Workspace pueden requerir otra prueba de propiedad incluso con `email_verified=true`, y recomienda identificar al usuario mediante `sub`: [verificación oficial](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

## Recomendación

Persistir la relación proveedor + subject. Exigir una sesión local o desafío verificable para vincular una cuenta existente y evaluar los claims de autoridad del email. Mantener la validación de firma, emisor, audiencia y expiración ya delegada a la biblioteca.

---

# Vulnerabilidad: H13 — Generación IA sin cuotas ni control de concurrencia

## Severidad

Alta. Confirmada en el flujo; no se consumieron servicios facturados.

## Categoría OWASP

A06:2025 — Insecure Design.

## Ubicación

[GeneracionIAController.java:57](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/GeneracionIAController.java:57), [GeneracionIAService.java:75](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/GeneracionIAService.java:75), [ChatController.java:26](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/ChatController.java:26).

## Descripción

Crear una generación guarda un registro e inicia `CompletableFuture.runAsync` hacia Tripo3D. No se identifican usuario propietario, cuota, presupuesto ni límite de trabajos pendientes. El endpoint queda abierto por H01. El trabajo consulta repetidamente al proveedor y descarga el resultado completo en memoria. El chat también acepta solicitudes públicas y usa un `RestTemplate` sin timeout configurado en este código.

## Impacto

Consumo de créditos, almacenamiento y conexiones, acumulación de trabajos y degradación del servicio. Aun cerrando el acceso anónimo, una cuenta válida podría abusar del flujo sin cuotas propias.

## Evidencia

Generación: líneas 79–82 inicia un trabajo por petición; líneas 197–204 invoca el proveedor; líneas 241–256 realiza polling; línea 311 lee todos los bytes. No se hallaron controles de cuota o limitadores en los servicios revisados ni en Nginx/Compose.

## Recomendación

Exigir identidad y permiso; aplicar cuotas de usuario y presupuesto global, idempotencia y una cola con concurrencia acotada. Configurar tiempos máximos, cancelación y tamaño de descarga. Registrar gasto y alertar antes de agotar créditos. Limitar el chat por separado si debe seguir siendo público.

---

# Vulnerabilidad: H14 — Archivos sin validación suficiente y documentos con URL pública

## Severidad

Alta. Flujo de carga y generación de URL confirmado; permisos efectivos de R2 no verificados.

## Categoría OWASP

A02:2025 — Security Misconfiguration; A01:2025 — Broken Access Control.

## Ubicación

[EvidenciaProduccionController.java:61](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/EvidenciaProduccionController.java:61), [EvidenciaProduccionService.java:59](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/EvidenciaProduccionService.java:59), [CloudflareR2StorageAdapter.java:45](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/storage/CloudflareR2StorageAdapter.java:45), [WebConfig.java:21](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/WebConfig.java:21).

## Descripción

La carga comprueba que existan etapa y empleado, pero no valida que pertenezcan al solicitante ni verifica firma del archivo, tipo permitido o coherencia MIME/extensión. El adaptador principal (`@Primary`) es R2: conserva la extensión y el `Content-Type` enviados y devuelve `publicUrl + key`, incluso para documentos de evidencias.

También existe un manejador público de `/storage/**` para archivos locales. Su contenido real no se inspeccionó. El adaptador local no es el seleccionado por defecto.

## Impacto

Almacenamiento de contenido activo o malicioso, abuso del bucket y posible acceso a documentos internos mediante URLs compartibles. Una URL aleatoria reduce descubrimiento, pero no verifica el derecho a descargar. No se concluye ejecución remota en Java por subir un archivo ni XSS del origen del frontend solo por alojarlo en otro dominio.

## Evidencia

`subirEvidencia` líneas 67–69 deriva una carpeta del texto de tipo y sube el archivo. El adaptador R2 líneas 49–63 copia extensión/MIME y devuelve URL pública. El controlador admite un `id_emp` suministrado por el solicitante.

## Recomendación

Aplicar autorización por recurso, listas permitidas, inspección de firma/tamaño, cuarentena y análisis cuando corresponda. Separar catálogo público de documentos privados; descargar estos últimos con autorización y URLs firmadas breves. Servir contenido potencialmente activo desde un origen aislado y con disposición de descarga apropiada.

---

# Vulnerabilidad: H15 — Restablecimiento de contraseña sin política en servidor

## Severidad

Media. Confirmada por ausencia de validación en este flujo.

## Categoría OWASP

A07:2025 — Authentication Failures.

## Ubicación

[AuthController.java:119](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/AuthController.java:119), [PasswordResetService.java:50](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/PasswordResetService.java:50).

## Descripción

El endpoint obtiene la contraseña de un `Map` sin validación. El servicio verifica el token y pasa el nuevo valor directamente a BCrypt. La regla de mínimo seis caracteres del registro no se aplica aquí. Un valor vacío o demasiado débil no se rechaza por una política del servidor antes de codificarlo.

## Impacto

Un usuario con token de recuperación válido puede establecer una contraseña que el registro rechazaría. Facilita cuentas débiles y deja errores de nulos/tamaños a bibliotecas o al manejador genérico. No permite por sí solo restablecer una contraseña sin token válido.

## Evidencia

`PasswordResetService` línea 61 llama `passwordEncoder.encode(newPassword)` sin validaciones previas. La expiración, el propósito `PASSWORD_RESET` y la eliminación del token tras uso secuencial sí están implementados.

## Recomendación

Centralizar la política y aplicarla en registro, recuperación y cambios administrativos. Rechazar nulos/vacíos, establecer límites compatibles con el codificador y detectar contraseñas comunes/comprometidas. Consumir el token y actualizar la contraseña atómicamente; invalidar las sesiones anteriores como en H10.

---

# Vulnerabilidad: H16 — Autenticación y recuperación sin límite de intentos

## Severidad

Media. Ausencia de controles en los componentes disponibles; no se hizo fuerza bruta.

## Categoría OWASP

A07:2025 — Authentication Failures.

## Ubicación

[AuthController.java:42](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/AuthController.java:42), [LoginService.java:95](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/LoginService.java:95), [PasswordResetService.java:32](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/PasswordResetService.java:32), [nginx.conf:1](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/nginx.conf:1).

## Descripción

Login, OTP, registro y recuperación aceptan intentos sin contador, espera progresiva ni limitador visible. Un token 2FA permanece válido cinco minutos sin límite de códigos probados. La recuperación crea un token y solicita enviar un correo por cada petición válida para una cuenta existente.

## Impacto

Facilita ataques de contraseñas reutilizadas, intentos de adivinación de OTP, spam de recuperación y consumo de recursos. No se presume que un OTP necesariamente pueda adivinarse dentro de su ventana; el rendimiento no fue medido.

## Evidencia

No se identificó rate limiting en configuración, filtros o servicios revisados. El Nginx definido solo sirve archivos y la API se publica directamente, por lo que un límite añadido únicamente al frontend no cubriría el puerto 8080.

## Recomendación

Limitar por cuenta, IP y operación; combinar espera progresiva con contadores compartidos entre réplicas y alertas. Evitar bloqueos permanentes que un tercero pueda provocar. Limitar los envíos de recuperación y los intentos por desafío 2FA.

---

# Vulnerabilidad: H17 — Paginación y límites de solicitudes permiten consumo excesivo

## Severidad

Media. Configuración y rutas confirmadas; no se provocó indisponibilidad.

## Categoría OWASP

A06:2025 — Insecure Design; A02:2025 — Security Misconfiguration.

## Ubicación

[UsuarioController.java:100](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/UsuarioController.java:100), [UsuarioJpaAdapter.java:109](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/persistence/UsuarioJpaAdapter.java:109), [TomcatConfig.java:18](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/TomcatConfig.java:18), [application.properties:53](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/resources/application.properties:53).

## Descripción

La consulta de usuarios sin paginación solicita `Integer.MAX_VALUE` registros. Los tamaños recibidos se pasan a `PageRequest` sin un máximo del servidor. Se permiten archivos de 200 MB y solicitudes de 250 MB, `max-swallow-size=-1` y hasta 10 000 parámetros; el customizer intenta elevar también el número de partes a 10 000. Compose no define límites propios de memoria, CPU o procesos por servicio.

## Impacto

Solicitudes concurrentes pueden aumentar consumo de memoria, consultas y espacio temporal. El efecto depende del volumen de datos, del contenedor y de los límites del host. La mera existencia de límites grandes no demuestra que ya haya ocurrido un DoS.

## Evidencia

Tamaño ilimitado práctico en `UsuarioController` línea 101; tamaño del cliente en `PageRequest.of`. Propiedades 54–57 y `TomcatConfig` líneas 21 y 25. No se atribuye el cierre 137 del contenedor a este hallazgo.

## Recomendación

Fijar tamaños máximos modestos por endpoint, usar exportaciones controladas para conjuntos completos y acotar partes/campos/tamaños. Mantener límites apropiados para modelos 3D mediante rutas específicas. Definir presupuestos por contenedor y medirlos con pruebas controladas en un entorno de ensayo.

---

# Vulnerabilidad: H18 — Exposición de mensajes internos y depuración

## Severidad

Media. Confirmada en los manejadores y configuración.

## Categoría OWASP

A10:2025 — Mishandling of Exceptional Conditions; A02:2025 — Security Misconfiguration.

## Ubicación

[GlobalExceptionHandler.java:13](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/GlobalExceptionHandler.java:13), [FavoritoController.java:185](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/FavoritoController.java:185), [application.properties:63](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/resources/application.properties:63).

## Descripción

Los manejadores genéricos devuelven `ex.getMessage()` directamente al consumidor. Algunos controladores hacen lo mismo. Se habilita DEBUG de Spring Web/Security y SQL; no existe en Compose un perfil de producción que reemplace estos ajustes.

## Impacto

Errores provocados pueden revelar detalles de clases, propiedades, integraciones o persistencia. Los logs pueden contener información técnica excesiva y URLs sensibles. No se afirma que DEBUG registre automáticamente todas las contraseñas; la copia concreta de secretos a auditoría se documenta en H07.

## Evidencia

`ApiResponse.error("Error interno del servidor: " + ex.getMessage())` y `ApiResponse.error(ex.getMessage())`. La excepción de integridad tiene un mensaje genérico, lo cual limita esa vía particular.

## Recomendación

Devolver mensajes y códigos públicos estables con identificador de correlación. Mantener el detalle en logs protegidos y redactados. Configurar niveles apropiados para producción y respuestas 4xx específicas para errores de validación; no convertir silenciosamente fallos en respuestas exitosas vacías.

---

# Vulnerabilidad: H19 — Despliegue definido sin HTTPS

## Severidad

Media. Riesgo de despliegue en redes; en uso exclusivo mediante loopback su exposición es menor.

## Categoría OWASP

A04:2025 — Cryptographic Failures.

## Ubicación

[nginx.conf:2](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/nginx.conf:2), [axios.ts:4](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/api/axios.ts:4), [compose.yml:28](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/compose.yml:28), [PasswordResetService.java:37](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/application/interactor/PasswordResetService.java:37).

## Descripción

Nginx escucha en HTTP/80, el frontend llama a HTTP/8080 y no hay terminación TLS en el Compose revisado. El enlace de recuperación está fijado a HTTP/5173, distinto del frontend Docker en puerto 80. No se observó un proxy TLS externo, aunque podría existir fuera del proyecto.

## Impacto

Si este esquema se publica en una red, credenciales, JWT y datos personales pueden viajar sin cifrado en el tramo expuesto. En otra computadora, el `localhost` del frontend apuntará a esa computadora, creando además errores funcionales de conexión/recuperación.

## Evidencia

URLs HTTP explícitas en los archivos citados y ausencia de configuración TLS en Nginx/Compose. No se realizaron capturas de tráfico.

## Recomendación

Configurar un origen público HTTPS y un proxy hacia el backend interno, con certificados válidos. Mantener URLs por entorno para API y recuperación. Aplicar HSTS una vez validado HTTPS y evitar publicar simultáneamente una ruta HTTP alternativa que exponga la misma API.

---

# Vulnerabilidad: H20 — Publicación amplia de PostgreSQL y del backend

## Severidad

Media. Confirmada en Compose; accesibilidad efectiva desde otras redes no comprobada.

## Categoría OWASP

A02:2025 — Security Misconfiguration.

## Ubicación

[compose.yml:10](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/compose.yml:10), [compose.yml:30](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/compose.yml:30).

## Descripción

Los mapeos `5433:5432` y `8080:8080` no fijan una interfaz de host. Docker publica por defecto en las interfaces del host; el acceso final depende de Docker Desktop, firewall y enrutamiento. No equivale a demostrar exposición a Internet. Véase [publicación de puertos de Docker](https://docs.docker.com/engine/network/port-publishing/).

## Impacto

Puede quedar accesible PostgreSQL fuera de la aplicación y la API directamente fuera del punto de entrada previsto. Un futuro control instalado solo en Nginx podría eludirse por 8080 mientras continúe publicado.

## Evidencia

El backend ya usa `jdbc:postgresql://db:5432/...`; no necesita el puerto 5433 del host para comunicarse con la base de datos. Nginx no contiene actualmente un proxy hacia la API, por lo que el acceso directo a 8080 sí forma parte del diseño presente.

## Recomendación

En desarrollo, vincular los puertos de administración a loopback cuando sean necesarios. En producción, mantener PostgreSQL en una red interna y publicar el backend a través del punto de entrada HTTPS. Coordinar el cambio con la URL del frontend y comprobar el firewall real.

---

# Vulnerabilidad: H21 — Credenciales de inicialización de PostgreSQL usadas por la aplicación

## Severidad

Media. Riesgo confirmado en el diseño de inicialización; privilegios del volumen existente pendientes de verificar.

## Categoría OWASP

A02:2025 — Security Misconfiguration; A01:2025 — Broken Access Control.

## Ubicación

[compose.yml:6](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/compose.yml:6), [compose.yml:25](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/compose.yml:25), [application.properties:12](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/resources/application.properties:12).

## Descripción

Compose utiliza el mismo `POSTGRES_USER` para inicializar la base y conectar Spring. La imagen oficial crea ese usuario con privilegios de superusuario al inicializar un directorio de datos vacío. Un volumen ya inicializado puede tener permisos distintos; no se consultó `pg_roles`. [Documentación de la imagen oficial](https://github.com/docker-library/docs/blob/master/postgres/content.md).

## Impacto

Un compromiso del proceso backend podría heredar privilegios muy superiores a los necesarios para operar sus tablas. `ddl-auto=update` también permite cambios de esquema durante el arranque y dificulta separar permisos de migración de los de operación.

## Evidencia

La misma variable se asigna a `POSTGRES_USER` y `SPRING_DATASOURCE_USERNAME`. No se define un usuario de aplicación separado ni scripts de concesión mínima en este Compose.

## Recomendación

Crear una cuenta de aplicación sin superusuario, creación de roles o bases, limitada a los objetos necesarios. Usar una identidad separada para migraciones y `ddl-auto=validate` cuando el esquema se gestione formalmente. Comprobar primero los privilegios reales antes de modificar el volumen existente.

---

# Dependencias: resultados y aplicabilidad

## Consulta npm ejecutada

Se ejecutó `npm audit --json --package-lock-only --ignore-scripts` contra [package-lock.json](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/package-lock.json), usando el CLI instalado de Node/npm. El launcher habitual estaba roto; la consulta con el CLI real y acceso autorizado al registro sí terminó. El código de salida 1 del audit completo indica avisos encontrados. No se instalaron ni actualizaron paquetes.

El registro reportó **22 paquetes afectados: 1 crítico, 15 altos, 5 moderados y 1 bajo**. Son clasificaciones del escáner por paquete, no 22 vulnerabilidades explotadas en esta aplicación ni un número de CVE únicos. Incluye herramientas de desarrollo y dependencias transitivas.

| Severidad reportada | Paquetes |
|---|---|
| Crítica (1) | `swiper` |
| Alta (15) | `axios`, `brace-expansion`, `browserslist`, `flatted`, `form-data`, `js-yaml`, `minimatch`, `nanoid`, `picomatch`, `postcss`, `react-router`, `react-router-dom`, `rollup`, `vite`, `xlsx` |
| Moderada (5) | `@humanfs/node`, `ajv`, `baseline-browser-mapping`, `fflate`, `follow-redirects` |
| Baja (1) | `@babel/core` |

## Versiones y alcance contrastado

| Componente | Versión observada | Interpretación en este proyecto |
|---|---|---|
| React | 19.2.0 | Versión del lockfile; la ausencia en la salida de npm no es certificación de seguridad. |
| Swiper | 11.2.10 | Dentro del rango del aviso de prototype pollution. La búsqueda en `src` encontró solo importación de CSS en `main.tsx`, no uso del constructor JS con opciones del usuario; no se confirmó explotación. [Aviso del mantenedor](https://github.com/nolimits4web/swiper/security/advisories/GHSA-hmx5-qpq5-p643). |
| Axios | 1.13.2 | Incluido en rangos de varios avisos. Los problemas de `NO_PROXY`/adaptador HTTP de Node no se trasladan directamente al Axios del navegador. Los gadgets de contaminación de prototipos requieren una fuente adicional que no se confirmó. [Aviso del mantenedor](https://github.com/axios/axios/security/advisories/GHSA-pf86-5x62-jrwf). |
| React Router / DOM | 7.9.6 | Se usa `BrowserRouter`. El aviso GHSA-2w69-qvjg-hvjx excluye expresamente este modo declarativo. Los avisos de RSC/SSR/servidor requieren funciones no observadas en este frontend estático. Esto no descarta otros avisos de la lista. [Alcance oficial](https://github.com/remix-run/react-router/security/advisories/GHSA-2w69-qvjg-hvjx). |
| Vite | 6.4.1 | Afectado por un aviso de lectura mediante WebSocket del servidor de desarrollo. El contenedor final ejecuta Nginx, no Vite; no se confirmó esa exposición en el despliegue descrito. Actualizar también protege desarrollo/CI. [Aviso oficial](https://github.com/vitejs/vite/security/advisories/GHSA-p9ff-h696-f583). |
| SheetJS `xlsx` | 0.18.5 | Afectado por CVE-2023-30533 y CVE-2024-22363. El uso localizado en reportes exporta; no se encontró importación de archivos arbitrarios. El proveedor excluye expresamente exportación para el primer CVE. No se demostró alcance del segundo en este flujo. [Prototype pollution](https://cdn.sheetjs.com/advisories/CVE-2023-30533), [ReDoS](https://cdn.sheetjs.com/advisories/CVE-2024-22363). |
| PostCSS / Rollup | 8.5.6 / 4.53.3 | Avisos en herramientas de construcción; no confundir con servicios Node expuestos en producción. Revisar entradas de build y actualizar con validación. |

En React Router, 7.9.6 ya corrige el aviso antiguo GHSA-9jcx-v3wj-wh4m; no se le atribuye ese CVE por asociación. [Versión corregida del mantenedor](https://github.com/remix-run/react-router/security/advisories/GHSA-9jcx-v3wj-wh4m).

## Backend e imágenes

[pom.xml:5](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/pom.xml:5) usa Spring Boot 4.0.3 y Java 21. El BOM 4.0.3 disponible en la caché Maven declara Spring Framework 7.0.5, Spring Security 7.0.3, Tomcat 11.0.18, PostgreSQL JDBC 42.7.10 y Jackson BOM 3.0.4. **Es inventario del BOM, no un SBOM verificado de la imagen final.**

Dependencias fijadas directamente: JJWT 0.12.6, TOTP 1.7.1, Google API Client 2.5.0, OpenPDF 1.3.30 y AWS SDK S3 2.25.60. No se deducen CVE únicamente por antigüedad ni se declara que estén libres de ellos.

- Spring Security 7.0.3 está en el rango de **CVE-2026-22732**, relativo a cabeceras que pueden no escribirse bajo ciertas condiciones. El aviso indica corrección en 7.0.4 para esa rama. Se requiere verificar respuestas reales y actualizar a un conjunto mantenido de dependencias que cubra también avisos posteriores. No se da por comprobada la ausencia ni presencia efectiva de todas las cabeceras. [Aviso oficial de Spring](https://spring.io/security/cve-2026-22732/).
- Tomcat 11.0.18 aparece en rangos de avisos posteriores. Por ejemplo, **CVE-2026-24880** requiere un proxy anterior que tolere ciertas extensiones de chunks; el Nginx revisado no proxyfica la API. No se afirma request smuggling demostrado. Los avisos de TLS de cliente o clustering no deben aplicarse sin esas funciones. [Avisos oficiales Tomcat 11](https://tomcat.apache.org/security-11.html).
- No se ejecutó un análisis SCA completo del árbol Maven ni un escáner de imágenes/SO. La versión puntual de los paquetes de las imágenes `postgres:17`, `nginx:1.27-alpine` y las imágenes Java/Node no se infiere de sus etiquetas. Hace falta inventario por digest y escaneo de esas imágenes concretas.

**Recomendación:** priorizar dependencias usadas en ejecución y las herramientas que procesen entradas no confiables, actualizar lockfile/BOM de forma revisada y validar autenticación, carga y generación de artefactos. Para SheetJS, npm indicó `fixAvailable=false`; consultar la distribución mantenida del proveedor en lugar de asumir que `npm audit fix` lo resolverá. Los avisos con explotación no confirmada quedan separados del conteo H01–H21.

---

# Evaluación de controles y posibles falsos positivos

## CORS

[CorsConfig.java:16](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/CorsConfig.java:16) registra una lista de orígenes exactos, usada por `.cors(withDefaults())`; Compose define `http://localhost` y `http://localhost:5173`. Se permiten credenciales, pero no se configura `*` como origen en esa fuente activa.

Sí hay configuraciones adicionales con `*` en [WebConfig.java:14](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/config/WebConfig.java:14) y anotaciones de controladores. Esto es inconsistente y debe unificarse, pero **no demuestra por sí solo que el filtro de Spring Security permita leer respuestas desde cualquier origen**. No se ejecutaron preflights con los servicios detenidos. CORS tampoco impide que un cliente HTTP externo use la API abierta de H01.

## SQL Injection

No se confirmó SQL Injection en las rutas revisadas. Favoritos enlaza `?1` con `setParameter`; roles/permisos usa placeholders JDBC; dashboards usa parámetros nombrados; filtros de usuarios usan Criteria/Specifications. Concatenar fragmentos SQL constantes no equivale a concatenar entrada del atacante.

[GenericFilterSpecification.java:117](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/persistence/GenericFilterSpecification.java:117) construye criterios y admite nombres de campos/relaciones de entrada; conviene restringir campos consultables y no ignorar filtros inválidos silenciosamente. Esto no se etiqueta como SQL Injection sin una vía de entrada a SQL sin parámetros. Tampoco se ejecutaron payloads contra la base de datos.

## CSRF

La configuración desactiva CSRF y declara sesión stateless. El cliente usa Bearer en `Authorization`; no se identificó una cookie propia de sesión/autenticación enviada automáticamente en estos flujos. **Desactivar CSRF no demuestra por sí solo una vulnerabilidad explotable en este diseño.** H01 es acceso anónimo indebido y H11 es divulgación de tokens, con causas específicas.

Si se cambia a cookies, deberán implementarse explícitamente protección CSRF, `SameSite`, `Secure`, comprobación de origen y el flujo correcto de login federado. `allowCredentials=true` no significa que se haya implementado una sesión mediante cookies.

## Tokens, datos del navegador y rutas

El almacenamiento persistente en `localStorage` amplifica H05 y H11: cualquier script que consiga ejecutarse en el origen puede leer el token. [axios.ts:12](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/api/axios.ts:12) y [UserContext.tsx:50](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/frontend/src/context/UserContext.tsx:50) muestran ese manejo. No se cuenta como otra vía independiente de XSS. Evaluar tokens en memoria o una sesión mediante cookie HttpOnly con las defensas correspondientes; ninguna alternativa corrige por sí sola un XSS.

Los claims JWT incluyen identidad, email y permisos; están firmados, no cifrados. La firma y expiración sí se validan por JJWT. No se encontró aceptación explícita de `alg=none`. Faltan controles de propósito/revocación ya descritos. La UI y datos de rol en el navegador deben tratarse como presentación, nunca como fuente de autoridad.

ReactMarkdown no usa `rehypeRaw` en los componentes examinados. Su uso no se etiqueta automáticamente como XSS; H11 persiste incluso sin HTML crudo ni ejecución de scripts.

## Controles presentes que deben conservarse

- BCrypt para hash y comparación de contraseñas mediante [SpringBCryptPasswordEncoder.java:10](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/security/SpringBCryptPasswordEncoder.java:10).
- Verificación criptográfica del ID token de Google con audiencia esperada; el problema adicional es cómo se vincula a la cuenta local.
- Expiración y propósito de recuperación, UUID aleatorio y eliminación tras uso secuencial; el correo de respuesta no confirma directamente si existe la cuenta.
- Comprobaciones de propietario en consultas/cancelación de cotizaciones y consultas de pedidos/producciones del portal. Los endpoints administrativos paralelos abiertos pueden eludir esa protección, por lo que debe revisarse la superficie completa.
- Archivos con nombre UUID en los adaptadores del backend; esto no sustituye controles de tipo ni autorización.
- Construcciones multietapa Docker: Nginx sirve estáticos y el JRE ejecuta el JAR. No se interpreta Node/Vite como servidor de producción.
- Protección de rol en `/api/backup`. La imagen Java no instala explícitamente `pg_dump`, por lo que su funcionamiento debe comprobarse antes de usarlo como mecanismo de continuidad; no se ejecutó backup.

---

# Observaciones adicionales y mejoras preventivas

1. **Identidad reenviada a n8n:** [ChatController.java:74](C:/Users/USUARIO/Desktop/Proyectos/Proyecto-Integrador_v2/Proyecto_integrador-Develop/Proyecto_integrador-v2/backend/src/main/java/com/changuitostudio/backend/infrastructure/controller/ChatController.java:74) envía JWT, ID, nombre y rol a un servicio externo por HTTPS. Es una ampliación real del perímetro de confianza, no prueba de que ese servicio sea malicioso. Usar credenciales delegadas con alcance y duración mínimos y revisar retención de ejecuciones/logs del workflow. No se auditó su configuración ni se presume que la IA sea una barrera de autorización.
2. **DTO de salida:** el portal retorna algunas entidades JPA completas. `UsuarioEntity` tiene getters de hash y secreto 2FA sin exclusiones de serialización y puede aparecer por relaciones. Reemplazar respuestas por DTO explícitos y verificar JSON real. La posible exposición por relaciones queda pendiente porque no se probó la serialización, a diferencia del flujo de auditoría de H07.
3. **Transacciones y concurrencia:** compra directa captura excepciones dentro de `@Transactional`, y no se observaron `@Version` o bloqueos de stock en la entidad/repositorio de muebles. Revisar rollback, stock agregado cuando un producto se repite, carreras entre compradores e idempotencia de pagos. No se provocaron carreras ni persistencias parciales.
4. **Almacenamiento local alternativo:** `LocalStorageAdapter.delete` resuelve una ruta sin comprobar que la ruta normalizada permanezca dentro de `storage`. El adaptador principal actual es R2 y no se probó una entrada pública que explote este método; se trata de una revisión preventiva de una implementación alternativa.
5. **Descarga desde proveedores:** `GeneracionIAService` descarga una URL retornada por Tripo3D y la lee completa. No se encontró que el usuario pueda sustituir directamente esa URL en el flujo de descarga; no se afirma SSRF arbitrario confirmado. Restringir destinos y tamaño ayuda frente a respuestas comprometidas o cambios del proveedor.
6. **Contenedores:** el Dockerfile del backend no define un `USER` propio, ni Compose endurece capacidades, filesystem o recursos. Comprobar el usuario efectivo de la imagen y ejecutar con privilegios mínimos, volúmenes limitados y filesystem de solo lectura donde proceda. No se detectó modo `privileged`, montaje del socket Docker ni una vía demostrada de escape de contenedor.
7. **Cabeceras del frontend:** Nginx no define CSP, `frame-ancestors`/protección de enmarcado ni una política de referencia específica. Añadir políticas compatibles con React, modelos 3D, imágenes y proveedores. Comprobar cabeceras en la respuesta del frontend y backend por separado; la configuración de Spring no protege automáticamente HTML servido por Nginx.
8. **Escalabilidad:** compartir límites de intentos, revocaciones y cuotas entre réplicas; separar trabajos IA del proceso web; conservar trazabilidad con identidades verificadas. Los permisos de roles deben tener una fuente coherente: el filtro trata solo ID 1 como administrador mientras el chat también trata ID 5 como administrador.
9. **Producción y mantenimiento:** separar perfiles, gestionar migraciones, fijar y escanear imágenes por digest, incorporar revisión de secretos y dependencias y alertas de autenticación. No se encontró un directorio fuente `backend/src/test` en esta revisión; el Dockerfile además usa `-DskipTests`. Añadir pruebas de autorización que ejerciten la API directamente.
10. **Protección de datos y continuidad:** definir acceso/retención a datos personales, logs, evidencias y backups. Probar recuperación de copias cifradas con una identidad limitada. El healthcheck de PostgreSQL solo comprueba disponibilidad y no valida autenticación, autorización o recuperación de datos.

---

# Plan de verificación después de corregir

Estas pruebas quedan **pendientes** y deben ejecutarse sobre una instancia de ensayo con datos de prueba. No son resultados de esta auditoría.

| Área | Criterio de aceptación |
|---|---|
| API | Sin token/inválido: 401; token válido sin permiso: 403; acceso permitido solo a la operación autorizada. Revisar métodos alternativos y aliases de rutas. |
| Registro | Campos de rol del cliente rechazados o ignorados; todas las altas públicas reciben el rol mínimo fijado por servidor. |
| 2FA | Token pendiente rechazado por portal, chat privilegiado, generación/configuración y desactivación 2FA; desafío de un solo uso. |
| Sesiones | Login de cuenta inactiva rechazado; JWT previo a deshabilitación, cambio de contraseña o revocación no conserva acceso. |
| Pertenencia | Usuario A no puede leer/modificar favoritos, pedidos ni perfiles privados de B variando ID, cabecera o cuerpo. |
| Compras | Alterar precios del request no cambia el precio calculado; cantidades negativas/cero/excesivas y duplicados se gestionan correctamente; pagos requieren acreditación. |
| XSS | Texto con marcado se visualiza como texto y no ejecuta eventos en cada diálogo identificado. |
| Chat | Ni enlaces ni imágenes externas reciben tokens; no hay JWT en query strings ni payloads externos innecesarios. |
| Secretos | Ni repositorio actual, logs, JAR ni JavaScript distribuido contienen secretos permanentes del navegador; claves antiguas revocadas. |
| CORS/CSRF | Origen autorizado funciona; origen arbitrario falla en solicitudes/preflights; si se adoptan cookies, se comprueba protección CSRF. |
| Archivos | Tipos/tamaños no permitidos rechazados; documentos privados requieren propietario/permiso tanto para obtener URL como para descargar. |
| Errores | Entradas inválidas generan 4xx estables sin detalles internos; fallos inesperados usan correlación y no devuelven datos sensibles. |
| Docker/BD | Solo puertos previstos son accesibles; usuario DB sin superusuario; HTTPS válido y límites de recursos efectivos. |
| Dependencias | Nuevo audit y SBOM Maven/imágenes revisados por alcance; no basta con un conteo bruto ni con compilar exitosamente. |

---

# Resumen ejecutivo

## Nivel general de seguridad

**Riesgo crítico.** El diseño cliente-servidor existe, pero el servidor no aplica una frontera de autorización consistente. Docker organiza y ejecuta los servicios; no corrige los controles ausentes de la API ni oculta secretos incorporados al navegador.

El cierre de acceso general debe acompañarse de cambios en registro, 2FA, pertenencia de recursos, secretos y compras: arreglar solo las rutas de React o CORS dejaría las causas principales intactas. Esta valoración se refiere al código y despliegue definido cuando esté funcionando, no a una exposición a Internet demostrada durante la sesión.

## Resumen de vulnerabilidades

- Vulnerabilidades críticas: **4** — H01, H02, H03 y H07.
- Vulnerabilidades altas: **10** — H04, H05, H06 y H08–H14.
- Vulnerabilidades medias: **7** — H15–H21.
- Vulnerabilidades bajas: **0**.
- Total de hallazgos de código/configuración: **21**, con condiciones y límites especificados en cada uno.

**Por separado:** npm reportó **22 paquetes** afectados (1 crítico, 15 altos, 5 moderados y 1 bajo). No se suman al total anterior como explotaciones demostradas. Las observaciones preventivas tampoco se incluyen en ese conteo.

## Componentes afectados

Frontend React, backend Spring Boot, autenticación y 2FA, autorización/usuarios/roles, compras/pagos/inventario, auditoría y datos personales, almacenamiento de archivos, integraciones IA, configuración Docker y acceso a PostgreSQL.

## Recomendaciones prioritarias

1. Cerrar acceso administrativo anónimo, proteger `/api/me`, aplicar permisos en servidor y fijar el rol mínimo del registro público.
2. Rotar la clave JWT y secretos expuestos; retirar credenciales del frontend y datos sensibles de auditoría; revocar sesiones/tokens afectados.
3. Corregir la separación entre desafío 2FA y sesión completa; exigir pruebas adicionales para desactivar o cambiar el factor.
4. Eliminar interpolaciones HTML y la inserción de JWT en contenido del chat; verificar pertenencia de cada recurso en backend.
5. Recalcular precios y validar cantidades en servidor; separar intención y acreditación de pagos; proteger stock e idempotencia.
6. Preparar HTTPS, aislamiento de PostgreSQL, credenciales mínimas, perfiles de producción, límites y cuotas de servicios externos.
7. Actualizar dependencias con evaluación de alcance y completar pruebas dinámicas y escaneo de las imágenes concretas antes de considerar el sistema listo para producción.
