HU-15, HU-34 |||||||| Module | Responsibility | HU |
| ------------ | -------------------------------------------------------------------- | ------------------- |
| `negocio` | Business information (contact, location, social media, WhatsApp). | HU-01 |
| `productos` | Products, categories, images, featured products, search and filters. | HU-02…HU-04, HU-08 |
| `inventario` | Stock and movements (entries, exits, adjustments) with audit trail. | HU-09 |
| `pedidos` | Placing orders, order lines, statuses and status history. | HU-06, HU-10, HU-12 |
| `clientes` | Customer account and contact data; viewed from the admin panel. | HU-06, HU-11 |
| `contenido` | Promotions, events and media with a publication period. | HU-13 |
| `visitas` | Doctor visits. | HU-14 |
| `usuarios` | Internal users, roles and permissions. | HU-15 |
| `auth` | Guard that validates the Supabase JWT, and a roles decorator. | Cross-cutting |
| `health` | `GET /health` (already exists). | Cross-cutting |

## Data model

SRS conventions (2.2.3): plural table names, `snake_case` columns, primary
key `<entity>_id`, foreign keys named after the related entity,
normalization up to 3NF, and audit fields (`fecha_creacion`,
`fecha_modificacion`, `creado_por`, `modificado_por`) on tables that record
changes. In Prisma, models can be named in singular and mapped to the plural
table.

| Table                    | Main fields                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `negocio`                | nombre, descripcion, telefono, whatsapp, direccion, correo, instagram_url, facebook_url                                                                         |
| `categorias`             | categoria_id, nombre, estado                                                                                                                                    |
| `productos`              | producto_id, codigo (unique), nombre, descripcion, precio, imagen_url, categoria_id, destacado, estado (activo/inactivo)                                        |
| `inventarios`            | producto_id, cantidad_disponible, fecha_modificacion                                                                                                            |
| `movimientos_inventario` | movimiento_id, producto_id, tipo (entrada/salida/ajuste), cantidad, motivo, usuario_id, fecha_creacion                                                          |
| `clientes`               | cliente_id, auth_id (Supabase), nombre, correo (unique), telefono, direccion                                                                                    |
| `pedidos`                | pedido_id, codigo, cliente_id, total_estimado, descuento, tipo_entrega, zona_envio_id, direccion_entrega, contacto_entrega, costo_envio, estado, fecha_creacion |
| `detalle_pedido`         | pedido_id, producto_id, cantidad, precio_unitario, subtotal                                                                                                     |
| `estados_pedido`         | estado_pedido_id, pedido_id, estado, observaciones, usuario_id, fecha_creacion                                                                                  |
| `usuarios`               | usuario_id, auth_id (Supabase), nombre, correo (unique), rol_id, estado (activo/deshabilitado)                                                                  |
| `roles`                  | rol_id, nombre (administrador, empleado, propietario), estado                                                                                                   |
| `permisos`               | permiso_id, rol_id, recurso, accion                                                                                                                             |
| `promociones`            | promocion_id, titulo, descripcion, producto_id or categoria_id, descuento, fecha_inicio, fecha_fin, estado                                                      |
| `eventos`                | evento_id, nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, estado                                                                                      |
| `contenidos`             | contenido_id, titulo, descripcion, imagen_url, video_url, enlace, fecha_inicio, fecha_fin, estado                                                               |
| `visitas_doctor`         | visita_id, nombre_doctor, especialidad, descripcion, fecha, hora_inicio, hora_fin, estado, observaciones                                                        |
| `pagos_pedido`           | pago_id, pedido_id, monto, referencia, usuario_id, fecha_creacion                                                                                               |
| `descuentos_pedido`      | descuento_id, pedido_id, monto, motivo, usuario_id, fecha_creacion                                                                                              |
| `zonas_envio`            | zona_envio_id, nombre, estado                                                                                                                                   |

Key relationships:

- A customer has many orders; an order has many products through
  `detalle_pedido` (SRS 2.2.3).
- `detalle_pedido.precio_unitario` stores the price **at the time of the
  order**: if the product price changes later, the history does not.
- Each order status change is a row in `estados_pedido` (who, when and why);
  `pedidos.estado` holds the current status.
- Products and content are never deleted: they are disabled (`estado`) to
  keep the history.

Order statuses: `pendiente` (pending) → `en_revision` (in review) →
`confirmado` (confirmed) → `preparado` (prepared) → `entregado` (delivered),
and `cancelado` (cancelled) from any status before `entregado`.

## API

REST with JSON, documented in Swagger (`/docs`). Public routes for what
customers see and routes under `/admin` for the panel.

| Method and route                                                           | Access                                  | HU           |
| -------------------------------------------------------------------------- | --------------------------------------- | ------------ |
| `GET /negocio`                                                             | Public                                  | HU-01        |
| `PUT /admin/negocio`                                                       | Administrator                           | HU-32        |
| `GET /productos?buscar=&categoria=&page=`                                  | Public (active only)                    | HU-02, HU-03 |
| `GET /productos/destacados`                                                | Public                                  | HU-16        |
| `GET /productos/:id`                                                       | Public                                  | HU-04        |
| `GET /categorias`                                                          | Public                                  | HU-03        |
| `POST /pedidos`                                                            | Authenticated customer                  | HU-06        |
| `GET /pedidos/mios`                                                        | Authenticated customer                  | HU-06        |
| `GET/POST/PATCH /admin/productos`                                          | Staff, by permission                    | HU-08        |
| `GET /admin/inventario`, `POST /admin/inventario/movimientos`              | Administrator, employee                 | HU-09        |
| `GET /admin/pedidos`, `PATCH /admin/pedidos/:id/estado`                    | Administrator, employee                 | HU-10, HU-12 |
| `GET /admin/clientes`, `GET /admin/clientes/:id`                           | Administrator, employee                 | HU-11        |
| `GET /promociones`, `GET /eventos`, `GET /contenidos`                      | Public (active only)                    | HU-21        |
| `GET/POST/PATCH /admin/promociones`, `/admin/eventos`, `/admin/contenidos` | Administrator or authorized staff       | HU-13        |
| `GET /visitas-doctor`                                                      | Public (confirmed only)                 | HU-20        |
| `GET/POST/PATCH /admin/visitas-doctor`                                     | Administrator or authorized staff       | HU-14        |
| `GET/POST/PATCH /admin/usuarios`                                           | Administrator only                      | HU-15        |
| `GET /admin/yo`                                                            | Any internal user                       | HU-34        |
| `GET /zonas-envio`                                                         | Public                                  | HU-23        |
| `GET /pedidos/:codigo`                                                     | Authenticated customer (own only)       | HU-26        |
| `POST /clientes/registro`, `GET /clientes/yo`                              | Authenticated customer                  | HU-24, HU-25 |
| `GET/POST/PATCH /admin/categorias`                                         | Administrator                           | HU-27        |
| `POST /admin/productos/:id/imagen`                                         | Administrator or authorized staff       | HU-28        |
| `POST /admin/pedidos/:id/pago`                                             | Administrator, employee with permission | HU-29        |
| `POST /admin/pedidos/:id/cancelar`                                         | Administrator or authorized employee    | HU-30        |
| `POST /admin/pedidos/:id/descuento`                                        | Administrator only                      | HU-31        |

Error responses share a single format, so the frontends can show clear
messages (RNF-05):

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "El precio debe ser mayor a 0",
  "fields": { "precio": "..." }
}
```

| Code | When                                                         |
| ---- | ------------------------------------------------------------ |
| 400  | Invalid data (Zod) or a business rule is broken.             |
| 401  | No session or invalid token.                                 |
| 403  | Signed in, but the role is not allowed.                      |
| 404  | The resource does not exist or is not visible to this user.  |
| 409  | Conflict: duplicate code or email, not enough stock (RN-05). |
| 503  | Database or external service unavailable.                    |

Messages in `message` are in Spanish, because the frontends show them to
users as they are.

## Security (SRS 4.8)

- **Authentication:** Supabase Auth issues the JWT; the `auth` guard
  validates it against the JWKS (`SUPABASE_JWKS_URL`) and loads the user or
  customer.
- **Authorization:** roles decorator per endpoint. Rules RN-23, RN-27 and
  RN-28 are enforced in the service, not only in the frontend.
- **Validation:** every body, query and parameter goes through a Zod schema.
- **Audit trail:** administrative operations store `usuario_id` and date
  (inventory, order statuses, prices).
- **Secrets:** only in environment variables (`.env`, Render). Never in code.
- **CORS:** only the origins in `ALLOWED_ORIGINS`.

## Performance and availability

- Paginated lists; indexes on `productos(nombre)`, `productos(categoria_id)`
  and `pedidos(cliente_id, estado)`.
- Short cache for public reads (business, featured, categories); invalidated
  when the admin panel changes them.
- Images in Supabase Storage, served optimized by the frontends.
- `GET /health` checks the database connection once it is connected.

## Pending decisions

- When an order deducts stock (on **confirmed** or on **delivered**).
- Home delivery (RN-29 to RN-32): would add delivery type, address and
  shipping cost to `pedidos`.
- Whether permissions are fixed per role (simpler) or configurable through
  the `permisos` table (more flexible).
