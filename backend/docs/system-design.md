# System design — API (backend)

Fuente: SRS de Nativa 360, capítulo IV (diseño) y sección 2.2.3
(estándares de base de datos). El stack y el estado actual del scaffold están
en [`../AGENTS.md`](../AGENTS.md).

> Este documento es la **propuesta de diseño** para la primera versión. El
> modelo de datos y los endpoints se ajustan cuando se implemente cada HU; si
> algo cambia, se actualiza acá en el mismo PR.

## Lugar en la solución

```
 landing (Next.js) ─┐
 e-com   (Next.js) ─┼──► API (NestJS) ──► Postgres (Supabase)
 admin   (Next.js) ─┘        │
                             ├──► Supabase Auth (JWT de clientes y personal)
                             └──► Supabase Storage (imágenes de productos y contenido)
```

- Arquitectura en capas (SRS 4.2): **presentación** en los frontends,
  **lógica de negocio** en los servicios de NestJS y **acceso a datos** con
  Prisma.
- Los frontends **no** hablan directo con la base de datos. Supabase en el
  frontend se usa solo para autenticación (iniciar y cerrar sesión).
- WhatsApp no se integra: es un enlace `wa.me` que arma el frontend.

## Stack

NestJS + TypeScript estricto, Prisma Next con la extensión de Supabase,
`@supabase/supabase-js` para Auth y Storage, Zod (`nestjs-zod`) para validar
DTOs, Swagger en `/docs`, cache con `@nestjs/cache-manager` (Redis o
memoria), Jest para tests unitarios y e2e. Detalle en `../AGENTS.md`.

## Módulos

Un módulo de NestJS por dominio, en `src/<modulo>/` con su `controller`,
`service`, DTOs y tests. Los nombres siguen el SRS (2.2.2): métodos que
dicen lo que hacen, por ejemplo `crearProducto()` o `actualizarInventario()`.

| Módulo       | Responsabilidad                                                         | HU                  |
| ------------ | ----------------------------------------------------------------------- | ------------------- |
| `negocio`    | Información del negocio (contacto, ubicación, redes, WhatsApp).         | HU-01               |
| `productos`  | Productos, categorías, imágenes, destacados, búsqueda y filtros.        | HU-02…HU-04, HU-08  |
| `inventario` | Existencias y movimientos (entradas, salidas, ajustes) con auditoría.   | HU-09               |
| `pedidos`    | Registro de pedidos, detalle, estados e historial de cambios.           | HU-06, HU-10, HU-12 |
| `clientes`   | Cuenta y datos de contacto del cliente; consulta desde el admin.        | HU-06, HU-11        |
| `contenido`  | Promociones, eventos y contenido multimedia con período de publicación. | HU-13               |
| `visitas`    | Visitas del doctor.                                                     | HU-14               |
| `usuarios`   | Usuarios internos, roles y permisos.                                    | HU-15               |
| `auth`       | Guard que valida el JWT de Supabase y decorador de roles.               | Transversal         |
| `health`     | `GET /health` (ya existe).                                              | Transversal         |

## Modelo de datos

Convenciones del SRS (2.2.3): tablas en plural, columnas en `snake_case`,
clave primaria `<entidad>_id`, claves foráneas con el nombre de la entidad
relacionada, normalización hasta 3FN y campos de auditoría
(`fecha_creacion`, `fecha_modificacion`, `creado_por`, `modificado_por`) en
las tablas que registran cambios. En Prisma los modelos pueden nombrarse en
singular y mapearse a la tabla en plural.

| Tabla                    | Campos principales                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `negocio`                | nombre, descripcion, telefono, whatsapp, direccion, correo, instagram_url, facebook_url                                 |
| `categorias`             | categoria_id, nombre, estado                                                                                            |
| `productos`              | producto_id, codigo (único), nombre, descripcion, precio, imagen_url, categoria_id, destacado, estado (activo/inactivo) |
| `inventarios`            | producto_id, cantidad_disponible, fecha_modificacion                                                                    |
| `movimientos_inventario` | movimiento_id, producto_id, tipo (entrada/salida/ajuste), cantidad, motivo, usuario_id, fecha_creacion                  |
| `clientes`               | cliente_id, auth_id (Supabase), nombre, correo (único), telefono, direccion                                             |
| `pedidos`                | pedido_id, codigo, cliente_id, total_estimado, estado, fecha_creacion                                                   |
| `detalle_pedido`         | pedido_id, producto_id, cantidad, precio_unitario, subtotal                                                             |
| `estados_pedido`         | estado_pedido_id, pedido_id, estado, observaciones, usuario_id, fecha_creacion                                          |
| `usuarios`               | usuario_id, auth_id (Supabase), nombre, correo (único), rol_id, estado (activo/deshabilitado)                           |
| `roles`                  | rol_id, nombre (administrador, empleado, propietario), estado                                                           |
| `permisos`               | permiso_id, rol_id, recurso, accion                                                                                     |
| `promociones`            | promocion_id, titulo, descripcion, producto_id o categoria_id, descuento, fecha_inicio, fecha_fin, estado               |
| `eventos`                | evento_id, nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, estado                                              |
| `contenidos`             | contenido_id, titulo, descripcion, imagen_url, video_url, enlace, fecha_inicio, fecha_fin, estado                       |
| `visitas_doctor`         | visita_id, nombre_doctor, especialidad, descripcion, fecha, hora_inicio, hora_fin, estado, observaciones                |

Relaciones clave:

- Un cliente tiene muchos pedidos; un pedido tiene muchos productos a través
  de `detalle_pedido` (SRS 2.2.3).
- `detalle_pedido.precio_unitario` guarda el precio **al momento del
  pedido**: si después cambia el precio del producto, el historial no cambia.
- Cada cambio de estado de un pedido es una fila en `estados_pedido` (quién,
  cuándo y por qué); `pedidos.estado` guarda el estado actual.
- Los productos y el contenido no se borran: se deshabilitan (`estado`) para
  conservar el historial.

Estados de pedido: `pendiente` → `en_revision` → `confirmado` → `preparado`
→ `entregado`, y `cancelado` desde cualquier estado antes de `entregado`.

## API

REST con JSON, documentada en Swagger (`/docs`). Rutas públicas para lo que
ven los clientes y rutas bajo `/admin` para el panel.

| Método y ruta                                                              | Acceso                              | HU           |
| -------------------------------------------------------------------------- | ----------------------------------- | ------------ |
| `GET /negocio`                                                             | Público                             | HU-01        |
| `PUT /admin/negocio`                                                       | Administrador                       | HU-01        |
| `GET /productos?buscar=&categoria=&page=`                                  | Público (solo activos)              | HU-02, HU-03 |
| `GET /productos/destacados`                                                | Público                             | HU-01        |
| `GET /productos/:id`                                                       | Público                             | HU-04        |
| `GET /categorias`                                                          | Público                             | HU-03        |
| `POST /pedidos`                                                            | Cliente autenticado                 | HU-06        |
| `GET /pedidos/mios`                                                        | Cliente autenticado                 | HU-06        |
| `GET/POST/PATCH /admin/productos`                                          | Personal según permiso              | HU-08        |
| `GET/POST /admin/inventario`                                               | Administrador, empleado             | HU-09        |
| `GET /admin/pedidos`, `PATCH /admin/pedidos/:id/estado`                    | Administrador, empleado             | HU-10, HU-12 |
| `GET /admin/clientes`, `GET /admin/clientes/:id`                           | Administrador, empleado             | HU-11        |
| `GET /promociones`, `GET /eventos`, `GET /contenidos`                      | Público (solo vigentes)             | HU-13        |
| `GET/POST/PATCH /admin/promociones`, `/admin/eventos`, `/admin/contenidos` | Administrador o personal autorizado | HU-13        |
| `GET /visitas-doctor`                                                      | Público (solo confirmadas)          | HU-14        |
| `GET/POST/PATCH /admin/visitas-doctor`                                     | Administrador o personal autorizado | HU-14        |
| `GET/POST/PATCH /admin/usuarios`                                           | Solo administrador                  | HU-15        |
| `GET /admin/yo`                                                            | Cualquier usuario interno           | HU-15        |

Respuestas de error con un formato único, para que los frontends muestren
mensajes claros (RNF-05):

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "El precio debe ser mayor a 0",
  "fields": { "precio": "..." }
}
```

| Código | Cuándo                                                            |
| ------ | ----------------------------------------------------------------- |
| 400    | Datos inválidos (Zod) o regla de negocio incumplida.              |
| 401    | Sin sesión o token inválido.                                      |
| 403    | Con sesión, pero el rol no tiene permiso.                         |
| 404    | El recurso no existe o no es visible para ese usuario.            |
| 409    | Conflicto: código o correo duplicado, stock insuficiente (RN-05). |
| 503    | Base de datos o servicio externo no disponible.                   |

## Seguridad (SRS 4.8)

- **Autenticación:** Supabase Auth emite el JWT; el guard de `auth` lo valida
  contra el JWKS (`SUPABASE_JWKS_URL`) y carga el usuario o cliente.
- **Autorización:** decorador de roles por endpoint. Las reglas RN-23, RN-27
  y RN-28 se validan en el servicio, no solo en el frontend.
- **Validación:** todo body, query y parámetro pasa por un esquema Zod.
- **Trazabilidad:** las operaciones administrativas guardan `usuario_id` y
  fecha (inventario, estados de pedido, precios).
- **Secretos:** solo en variables de entorno (`.env`, Render). Nunca en el
  código.
- **CORS:** solo los orígenes de `ALLOWED_ORIGINS`.

## Rendimiento y disponibilidad

- Listados paginados; índices en `productos(nombre)`, `productos(categoria_id)`
  y `pedidos(cliente_id, estado)`.
- Cache corto para lecturas públicas (negocio, destacados, categorías); se
  invalida cuando el admin las modifica.
- Imágenes en Supabase Storage, servidas ya optimizadas por los frontends.
- `GET /health` comprueba la conexión a la base cuando esté conectada.

## Decisiones pendientes

- Momento en que un pedido descuenta inventario (al **confirmar** o al
  **entregar**).
- Entregas a domicilio (RN-29 a RN-32): agregarían tipo de entrega, dirección
  y costo de envío a `pedidos`.
- Si los permisos se manejan por rol fijo (más simple) o con la tabla
  `permisos` configurable (más flexible).
