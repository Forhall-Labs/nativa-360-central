# Requisitos — Landing Page

Fuente: SRS de Nativa 360, secciones 3.8.4.1 (requisitos funcionales),
3.8.5 (reglas de negocio) y 3.8.7 (requisitos no funcionales).

## Propósito

La landing es el punto de entrada del sitio: presenta a Nativa 360, sus
medios de contacto y algunos productos destacados, y lleva al visitante al
comercio electrónico o al WhatsApp del negocio.

## Usuarios

| Rol       | Qué hace en la landing                                           |
| --------- | ---------------------------------------------------------------- |
| Visitante | Cualquier persona, sin cuenta. Consulta información y navega.    |
| Cliente   | Igual que el visitante; desde acá entra al comercio electrónico. |

## Requisitos funcionales

| Código | Requisito                       | Descripción                                                                                                           | HU    |
| ------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----- |
| MO-01  | Mostrar información del negocio | Muestra nombre, teléfono, ubicación y medios de contacto de Nativa 360.                                               | HU-01 |
| MO-02  | Acceder a redes sociales        | Muestra enlaces a las redes sociales oficiales (Instagram, Facebook).                                                 | HU-01 |
| MO-03  | Mostrar productos destacados    | Muestra una selección de productos destacados con nombre, imagen, descripción y precio.                               | HU-01 |
| MO-04  | Acceder a WhatsApp              | Un botón abre una conversación de WhatsApp con el negocio. La atención es manual.                                     | HU-01 |
| MO-05  | Acceder al comercio electrónico | Un botón visible lleva al catálogo del comercio electrónico.                                                          | HU-01 |
| MO-06  | Mostrar visitas del doctor      | Muestra las visitas del doctor confirmadas: nombre, especialidad, fecha y horario. Se administran en `admin` (HU-14). | HU-14 |

## Reglas de negocio que aplican

| Código | Regla                                                                                 |
| ------ | ------------------------------------------------------------------------------------- |
| RN-02  | Solo se muestran productos activos (aplica a los destacados).                         |
| RN-19  | Una promoción solo se muestra durante su período de vigencia.                         |
| RN-35  | Solo se publican visitas del doctor con fecha y horario confirmados por el negocio.   |
| RN-36  | Una visita cancelada deja de anunciarse.                                              |
| RN-40  | El contenido con período de publicación definido solo se muestra durante ese período. |
| RN-42  | El contenido retirado de publicación deja de mostrarse.                               |

## Requisitos no funcionales

| Código | Tipo           | Cómo aplica a la landing                                                                   |
| ------ | -------------- | ------------------------------------------------------------------------------------------ |
| RNF-02 | Rendimiento    | Carga rápida; imágenes optimizadas, sobre todo en celulares y conexiones lentas.           |
| RNF-03 | Disponibilidad | Si la API no responde, la información estática del negocio igual se muestra.               |
| RNF-05 | Usabilidad     | Navegación simple, sin saturar de información; botones de acción claros.                   |
| RNF-06 | Accesibilidad  | Responsiva en computadora, tableta y celular; colores y tamaños de texto legibles.         |
| RNF-09 | Compatibilidad | Funciona en navegadores modernos.                                                          |
| RNF-10 | Integración    | WhatsApp y redes sociales son enlaces externos: no hay mensajes ni respuestas automáticas. |

## Fuera de alcance

- Registro, inicio de sesión o compras desde la landing (eso vive en `e-com`).
- Mensajes automáticos o chatbots de WhatsApp.
- Edición de contenido: todo lo que muestra la landing se administra desde
  `admin`.

## Pendientes de confirmar

- El SRS usa el código **MO-06** dos veces (visitas del doctor en la landing y
  productos disponibles en el e-commerce). Conviene renumerar uno en el SRS.
- Si las promociones y eventos (HU-13) también se muestran en la landing o
  solo en el e-commerce.
