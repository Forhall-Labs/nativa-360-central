# Requisitos — Administración y gestión

Fuente: SRS de Nativa 360, secciones 3.8.2.2 (roles), 3.8.4.3 (requisitos
funcionales), 3.8.5 (reglas de negocio) y 3.8.7 (requisitos no funcionales).

## Propósito

El panel de administración permite al personal autorizado gestionar
productos, inventario, pedidos, clientes y el contenido publicado en el sitio
(información del negocio, promociones, eventos, multimedia y visitas del
doctor). Cada función está disponible según el rol del usuario.

## Usuarios y roles

| Rol           | Qué puede hacer                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Administrador | Todo: productos, precios, inventario, pedidos, clientes, contenido, visitas del doctor, usuarios y permisos. |
| Empleado      | Consultar productos, actualizar existencias y avanzar los estados de los pedidos. No cambia precios.         |
| Propietario   | Consultar información y validar el sistema. Funciones administrativas solo si se le asignan.                 |

## Requisitos funcionales

| Código | Requisito                           | Descripción                                                                             | HU           |
| ------ | ----------------------------------- | --------------------------------------------------------------------------------------- | ------------ |
| MO-16  | Agregar productos                   | Registra productos con nombre, descripción, precio, imagen, categoría y disponibilidad. | HU-08        |
| MO-17  | Modificar productos                 | Actualiza la información de productos existentes.                                       | HU-08        |
| MO-18  | Deshabilitar productos              | Deshabilita productos que ya no se venden, sin borrar su historial.                     | HU-08        |
| MO-19  | Administrar imágenes de productos   | Agrega, cambia o actualiza las imágenes de un producto.                                 | HU-08        |
| MO-20  | Administrar información del negocio | Actualiza la información del negocio que muestra la landing.                            | HU-01, HU-13 |
| MO-21  | Administrar contenido informativo   | Agrega, modifica y deshabilita promociones, eventos e información publicada.            | HU-13        |
| MO-22  | Gestionar el inventario             | Consulta y actualiza las cantidades disponibles de los productos.                       | HU-09        |
| MO-23  | Gestionar pedidos                   | Consulta los pedidos registrados y su información.                                      | HU-10, HU-12 |
| MO-24  | Actualizar estados de pedidos       | Cambia el estado de un pedido según el avance de su gestión.                            | HU-10        |
| MO-25  | Consultar información de clientes   | Consulta los clientes y su historial de pedidos.                                        | HU-11, HU-12 |
| MO-26  | Gestionar usuarios y permisos       | Gestiona las cuentas internas y asigna permisos por rol.                                | HU-15        |
| MO-27  | Administrar visitas del doctor      | Registra, consulta, modifica, publica y deshabilita visitas del doctor.                 | HU-14        |

Estados de un pedido (HU-10): **pendiente**, **en revisión**, **confirmado**,
**preparado**, **entregado** y **cancelado**.

## Reglas de negocio que aplican

| Código | Regla                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------- |
| RN-01  | Cada producto tiene un código único.                                                              |
| RN-03  | Todo producto registra como mínimo nombre, descripción, precio e imagen.                          |
| RN-04  | Se puede actualizar la cantidad disponible de cada producto.                                      |
| RN-06  | Todo ajuste de inventario registra el motivo y el usuario responsable.                            |
| RN-10  | La disponibilidad final de los productos de un pedido la verifica manualmente el personal.        |
| RN-13  | Si un producto no está disponible, el personal se lo informa al cliente durante la coordinación.  |
| RN-14  | Un comprobante por WhatsApp no alcanza: una persona autorizada verifica que el dinero se recibió. |
| RN-15  | Solo el administrador o un empleado autorizado confirma el pago de un pedido.                     |
| RN-16  | Un pedido solo se envía cuando su pago está completo.                                             |
| RN-17  | El importe recibido debe coincidir con el total para considerar el pedido pagado.                 |
| RN-21  | No se acumulan dos promociones sobre un mismo producto.                                           |
| RN-23  | Solo el administrador autoriza descuentos manuales sobre un pedido.                               |
| RN-27  | Los empleados actualizan existencias, pero no modifican precios ni autorizan descuentos.          |
| RN-28  | Solo el administrador asigna o cambia roles.                                                      |
| RN-33  | Cancelar un pedido pagado requiere revisar el reembolso.                                          |
| RN-34  | La hora de fin de una visita del doctor es posterior a la de inicio.                              |
| RN-35  | Solo se publican visitas con fecha y horario confirmados.                                         |
| RN-36  | Una visita cancelada deja de anunciarse.                                                          |
| RN-37  | La fecha y hora de fin de un evento son posteriores a su inicio.                                  |
| RN-38  | Todo evento presencial indica una ubicación antes de publicarse.                                  |
| RN-39  | Solo el personal autorizado publica o retira contenido multimedia.                                |
| RN-41  | La fecha de fin de una publicación, si existe, es posterior a la de inicio.                       |

## Requisitos no funcionales

| Código | Tipo           | Cómo aplica al admin                                                                            |
| ------ | -------------- | ----------------------------------------------------------------------------------------------- |
| RNF-01 | Seguridad      | Requiere inicio de sesión; cada pantalla y acción se restringe según el rol.                    |
| RNF-04 | Recuperación   | Las acciones importantes (precios, inventario, estados) quedan registradas con usuario y fecha. |
| RNF-05 | Usabilidad     | Pensado para personal sin conocimientos técnicos; campos obligatorios marcados; errores claros. |
| RNF-06 | Accesibilidad  | Usable en computadora y tableta; responsivo en celular para consultas rápidas.                  |
| RNF-08 | Mantenibilidad | Módulos separados por dominio (productos, inventario, pedidos, clientes, contenido, usuarios).  |

## Fuera de alcance

- Envío automático de mensajes al cliente o confirmación automática de pagos.
- Gestión de citas o reservas con el doctor (HU-14 solo publica la visita).
- Borrado definitivo de productos o pedidos: se deshabilitan para conservar
  el historial.

## Pendientes de confirmar

- Si el empleado puede registrar productos nuevos o solo actualizarlos.
- Qué estados de pedido puede cambiar el empleado y cuáles solo el
  administrador (por ejemplo, confirmar pago o cancelar).
- Si las entradas, salidas y ajustes de inventario de HU-09 entran en la
  primera versión ("según el alcance definido").
