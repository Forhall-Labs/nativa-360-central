# Requisitos — Comercio electrónico

Fuente: SRS de Nativa 360, secciones 3.8.4.2 (requisitos funcionales),
3.8.5 (reglas de negocio) y 3.8.7 (requisitos no funcionales).

## Propósito

El comercio electrónico permite al cliente consultar el catálogo, buscar y
filtrar productos, armar un carrito y registrar un pedido. El pago y la
coordinación final se hacen **manualmente por WhatsApp** con el personal de
Nativa 360: no hay pagos en línea.

## Usuarios

| Rol       | Qué hace en el e-commerce                                                |
| --------- | ------------------------------------------------------------------------ |
| Visitante | Consulta el catálogo, busca, filtra y ve el detalle de los productos.    |
| Cliente   | Con cuenta registrada: arma el carrito, registra pedidos y ve los suyos. |

## Requisitos funcionales

| Código | Requisito                             | Descripción                                                                       | HU    |
| ------ | ------------------------------------- | --------------------------------------------------------------------------------- | ----- |
| MO-06  | Mostrar productos disponibles         | Muestra los productos con nombre, imagen, descripción, precio y disponibilidad.   | HU-02 |
| MO-07  | Buscar productos                      | Búsqueda por palabras del nombre, la descripción o las características.           | HU-03 |
| MO-08  | Filtrar productos                     | Filtro por categorías u otros criterios definidos.                                | HU-03 |
| MO-09  | Consultar el detalle de un producto   | Muestra nombre, descripción, imagen, precio, categoría y disponibilidad.          | HU-04 |
| MO-10  | Agregar productos al carrito          | Agrega al carrito productos disponibles.                                          | HU-05 |
| MO-11  | Modificar cantidades en el carrito    | Aumenta o disminuye las unidades de un producto en el carrito.                    | HU-05 |
| MO-12  | Eliminar productos del carrito        | Retira productos del carrito.                                                     | HU-05 |
| MO-13  | Calcular el total estimado            | Calcula y muestra el total estimado según precios y cantidades.                   | HU-05 |
| MO-14  | Registrar un pedido                   | Registra el pedido con productos, cantidades, datos del cliente y total estimado. | HU-06 |
| MO-15  | Coordinar el pedido mediante WhatsApp | Ofrece acceso al WhatsApp del negocio para coordinar manualmente pedido y pago.   | HU-07 |

## Reglas de negocio que aplican

| Código | Regla                                                                                 |
| ------ | ------------------------------------------------------------------------------------- |
| RN-02  | Solo se muestran en el catálogo los productos activos.                                |
| RN-05  | No se puede registrar un pedido con una cantidad mayor al inventario disponible.      |
| RN-09  | Al registrar un pedido se guardan los productos, sus cantidades y el total estimado.  |
| RN-10  | La disponibilidad final la verifica manualmente el personal.                          |
| RN-11  | La confirmación del pedido y del pago se hace manualmente por WhatsApp.               |
| RN-12  | El sistema no reserva productos mientras el pedido está pendiente de confirmación.    |
| RN-19  | Una promoción solo se aplica durante su período de vigencia.                          |
| RN-20  | Las promociones se aplican solo a los productos o categorías definidos para ellas.    |
| RN-21  | No se acumulan dos promociones sobre un mismo producto.                               |
| RN-24  | El cliente necesita una cuenta registrada para realizar pedidos.                      |
| RN-26  | Cada cliente solo puede consultar sus propios pedidos.                                |
| RN-30  | Un pedido con entrega a domicilio requiere dirección y contacto de entrega completos. |
| RN-31  | El costo de envío queda acordado antes de que el cliente confirme el pedido.          |
| RN-32  | Los pedidos para retiro en el local no tienen costo de envío.                         |

## Requisitos no funcionales

| Código | Tipo           | Cómo aplica al e-commerce                                                                 |
| ------ | -------------- | ----------------------------------------------------------------------------------------- |
| RNF-01 | Seguridad      | Las credenciales del cliente se protegen; cada cliente solo accede a sus datos y pedidos. |
| RNF-02 | Rendimiento    | Catálogo, búsqueda y filtros responden en un tiempo adecuado; imágenes optimizadas.       |
| RNF-03 | Disponibilidad | Si la API no responde, se muestra un mensaje claro en vez de una pantalla rota.           |
| RNF-05 | Usabilidad     | El catálogo se usa sin conocimientos técnicos; los errores dicen cómo corregirse.         |
| RNF-06 | Accesibilidad  | Responsivo en computadora, tableta y celular.                                             |
| RNF-09 | Compatibilidad | Funciona en navegadores modernos.                                                         |
| RNF-10 | Integración    | WhatsApp es un enlace: sin mensajes automáticos ni confirmación automática de pagos.      |

## Fuera de alcance

- Pagos en línea o confirmación automática de pagos.
- Mensajes o respuestas automáticas por WhatsApp.
- Reserva automática de inventario al registrar un pedido (RN-12).

## Pendientes de confirmar

- El alcance (1.7.2) habla de pedidos para **recoger en tienda**, pero las
  reglas RN-29 a RN-32 hablan de **entrega a domicilio**, zonas de cobertura
  y costo de envío. Confirmar con el propietario si la primera versión
  incluye entregas.
- Qué datos pide el registro de cuenta del cliente (RN-24) y si el pedido
  puede registrarse como invitado.
- Cómo se ve el precio cuando hay una promoción vigente (precio tachado,
  porcentaje, etc.).
