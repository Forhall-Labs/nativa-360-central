# Requisitos — API (backend)

Fuente: SRS de Nativa 360, secciones 3.8.3.3 y 3.8.3.4 (interfaces), 3.8.4
(requisitos funcionales), 3.8.5 (datos y reglas de negocio) y 3.8.7
(requisitos no funcionales).

## Propósito

La API es la única puerta a los datos de Nativa 360. La usan los tres
frontends (`landing`, `e-com`, `admin`) para consultar y actualizar
productos, inventario, pedidos, clientes, usuarios y contenido. Es también
donde se **hacen cumplir las reglas de negocio y los permisos**: los
frontends pueden validar para dar mejor experiencia, pero la decisión final
es siempre del backend.

## Consumidores

| Consumidor | Acceso                           | Usa la API para                                                                 |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------- |
| `landing`  | Público                          | Información del negocio, productos destacados, visitas del doctor, contenido.   |
| `e-com`    | Público y cliente autenticado    | Catálogo, búsqueda, detalle, registro de pedidos y consulta de pedidos propios. |
| `admin`    | Personal autenticado (según rol) | Gestión de productos, inventario, pedidos, clientes, contenido y usuarios.      |

## Requisitos funcionales por recurso

| Recurso                   | Operaciones                                                                 | Requisitos SRS               | HU                  |
| ------------------------- | --------------------------------------------------------------------------- | ---------------------------- | ------------------- |
| Información del negocio   | Consultar (público); actualizar (admin)                                     | MO-01, MO-02, MO-20          | HU-01               |
| Productos                 | Listar, buscar, filtrar, ver detalle (público); crear, editar, deshabilitar | MO-03, MO-06…MO-09, MO-16…19 | HU-02…HU-04, HU-08  |
| Categorías                | Listar (público); administrar (admin)                                       | MO-08                        | HU-03, HU-08        |
| Inventario                | Consultar y ajustar existencias con motivo y usuario                        | MO-22                        | HU-09               |
| Pedidos                   | Registrar (cliente); listar propios (cliente); listar, ver y cambiar estado | MO-14, MO-23, MO-24          | HU-06, HU-10, HU-12 |
| Clientes                  | Registro de cuenta (cliente); consultar clientes e historial (admin)        | MO-25                        | HU-06, HU-11        |
| Promociones y eventos     | Listar vigentes (público); crear, editar, deshabilitar (admin)              | MO-21                        | HU-13               |
| Contenido multimedia      | Listar publicado (público); publicar y retirar (admin)                      | MO-21                        | HU-13               |
| Visitas del doctor        | Listar confirmadas (público); crear, editar, publicar, deshabilitar (admin) | MO-06 (landing), MO-27       | HU-14               |
| Usuarios internos y roles | Crear, editar, activar, deshabilitar, asignar rol (solo administrador)      | MO-26                        | HU-15               |

El carrito (HU-05) vive en el navegador del cliente: la API solo recibe el
pedido final y valida productos, precios y cantidades.

## Reglas de negocio que la API hace cumplir

| Código       | Regla                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| RN-01        | Código de producto único.                                                                          |
| RN-02        | Los endpoints públicos solo devuelven productos activos.                                           |
| RN-03        | Producto con nombre, descripción, precio e imagen obligatorios.                                    |
| RN-05        | Rechaza pedidos con cantidades mayores al inventario disponible.                                   |
| RN-06        | Cada ajuste de inventario guarda motivo y usuario responsable.                                     |
| RN-09        | El pedido guarda productos, cantidades y total estimado (calculado en el servidor).                |
| RN-12        | Registrar un pedido no descuenta ni reserva inventario.                                            |
| RN-15…RN-17  | Solo administrador o empleado autorizado confirma pagos; el importe debe coincidir con el total.   |
| RN-19…RN-21  | Promociones solo vigentes, solo sobre sus productos o categorías, sin acumularse.                  |
| RN-23, RN-27 | Empleados no cambian precios ni autorizan descuentos; solo el administrador.                       |
| RN-24, RN-26 | Pedidos solo con cuenta de cliente; cada cliente ve solo sus pedidos.                              |
| RN-28        | Solo el administrador asigna o cambia roles.                                                       |
| RN-34…RN-38  | Fechas y horas de fin posteriores al inicio; solo se publica lo confirmado; eventos con ubicación. |
| RN-40…RN-42  | El contenido público respeta su período de publicación y deja de verse al retirarse.               |

## Requisitos no funcionales

| Código | Tipo           | Cómo aplica a la API                                                                                                    |
| ------ | -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| RNF-01 | Seguridad      | Autenticación con Supabase Auth (JWT); autorización por rol en cada endpoint; validación de toda entrada; CORS cerrado. |
| RNF-02 | Rendimiento    | Paginación en listados; índices para búsqueda y filtros; cache para lecturas públicas.                                  |
| RNF-03 | Disponibilidad | Endpoint `/health` para monitoreo; errores con formato consistente que los frontends puedan mostrar.                    |
| RNF-04 | Recuperación   | Base de datos con respaldos antes de producción; las operaciones confirmadas no se pierden ante fallos temporales.      |
| RNF-07 | Escalabilidad  | Un módulo de NestJS por recurso; nuevas funciones sin reestructurar lo existente.                                       |
| RNF-08 | Mantenibilidad | Contrato documentado en Swagger (`/docs`); tests unitarios y e2e.                                                       |

## Fuera de alcance

- Procesamiento de pagos en línea.
- Envío de mensajes de WhatsApp o integraciones con su API.
- Reserva automática de inventario (RN-12).

## Pendientes de confirmar

- Si el pedido descuenta inventario al pasar a **confirmado** o al pasar a
  **entregado** (RN-12 solo dice que no se reserva mientras está pendiente).
- Entregas a domicilio (RN-29 a RN-32): si entran en la primera versión, el
  pedido necesita tipo de entrega, dirección y costo de envío.
