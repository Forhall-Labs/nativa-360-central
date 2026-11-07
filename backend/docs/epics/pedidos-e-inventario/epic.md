# Épica: API de pedidos, inventario y clientes

> **Como** frontend de Nativa 360 (e-commerce y admin), **quiero** una API
> que registre pedidos, controle las existencias y entregue la información de
> los clientes, **para** que el negocio tenga un registro confiable de lo que
> vende.

## Alcance

| HU                        | Nombre                            | Frontend                                                                      |
| ------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| [HU-06](stories/HU-06.md) | Registrar un pedido               | [e-com](../../../../e-com/docs/epics/carrito-y-pedidos/stories/HU-06.md)      |
| [HU-09](stories/HU-09.md) | Gestionar el inventario           | [admin](../../../../admin/docs/epics/gestion-administrativa/stories/HU-09.md) |
| [HU-10](stories/HU-10.md) | Actualizar el estado de un pedido | [admin](../../../../admin/docs/epics/gestion-administrativa/stories/HU-10.md) |
| [HU-11](stories/HU-11.md) | Consultar información de clientes | [admin](../../../../admin/docs/epics/clientes-y-contenido/stories/HU-11.md)   |
| [HU-12](stories/HU-12.md) | Consultar el historial de pedidos | [admin](../../../../admin/docs/epics/clientes-y-contenido/stories/HU-12.md)   |

El carrito (HU-05) y WhatsApp (HU-07) no tienen endpoints propios: el carrito
vive en el navegador y se valida al registrar el pedido.

## Módulos

`pedidos`, `inventario` y `clientes` (ver
[system-design](../../system-design.md)).

## Requisitos relacionados

MO-14, MO-22 a MO-25 · RN-04 a RN-06, RN-09 a RN-17, RN-24, RN-26, RN-33 ·
RNF-01, RNF-04.
