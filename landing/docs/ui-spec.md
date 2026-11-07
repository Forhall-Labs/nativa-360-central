# UI spec — Landing Page

Fuente: SRS de Nativa 360, secciones 2.2.4 (estándares de interfaz), 3.8.2.6
(restricciones de diseño), 3.8.3.1 (interfaces de usuario) y 3.8.7.4
(usabilidad y accesibilidad).

## Identidad visual

Común a `landing`, `e-com` y `admin`: el cliente tiene que sentir que es el
mismo negocio en los tres.

| Elemento   | Lineamiento                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Colores    | **Azul** como color principal, **blanco** de fondo y **verde** solo como acento (poca presencia).  |
| Tipografía | Una sola familia sans serif para todo el sitio; jerarquía con tamaño y peso, no con otras fuentes. |
| Botones    | Mismo estilo en todas las pantallas: primario (azul relleno), secundario (borde azul).             |
| Mensajes   | Éxito, error, aviso e información con color e ícono propios, siempre con texto.                    |
| Espaciado  | Márgenes y espacios uniformes (escala de Tailwind); nada amontonado.                               |
| Idioma     | Español (`<html lang="es">`); precios en colones (₡).                                              |

Los colores se definen una sola vez como variables en `src/app/globals.css`
(`--color-primario`, `--color-acento`, `--color-fondo`, `--color-texto`,
`--color-error`, `--color-exito`) y se usan con las clases de Tailwind. Nunca
se escribe un color a mano en un componente.

## Principios de la landing

- **Vender la visita, no saturar:** pocas secciones, textos cortos, imágenes
  grandes de buena calidad.
- **Dos acciones siempre a mano:** "Ver tienda" (lleva al e-com) y
  "Escribinos por WhatsApp". En celular, el botón de WhatsApp queda fijo en
  una esquina.
- **Primero el celular:** la mayoría de los clientes llegan desde Instagram o
  Facebook en el teléfono.

## Secciones

| Sección               | Contenido y comportamiento                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Encabezado            | Logo a la izquierda; menú a las secciones; botón "Ver tienda". En celular el menú se abre con un botón.          |
| Presentación          | Título, una frase de quiénes son y una imagen del local o productos. Botones "Ver tienda" y WhatsApp.            |
| Productos destacados  | Tarjetas: imagen, nombre, descripción corta (2 líneas máx.) y precio. Al tocar una, abre su detalle en el e-com. |
| Promociones y eventos | Tarjetas con título, imagen y vigencia ("Hasta el 30 de noviembre"). Si no hay vigentes, la sección no aparece.  |
| Visitas del doctor    | Nombre del doctor, especialidad, fecha y horario. Si no hay visitas confirmadas, la sección no aparece.          |
| Contacto              | Dirección ("50 m este de la Municipalidad de Pérez Zeledón"), teléfono, mapa, horario y redes sociales.          |
| Pie de página         | Redes sociales, teléfono y derechos.                                                                             |

## Responsivo

| Ancho                 | Tarjetas por fila | Menú                   |
| --------------------- | ----------------- | ---------------------- |
| Celular (< 640 px)    | 1                 | Botón que abre el menú |
| Tableta (640–1024 px) | 2                 | Completo               |
| Computadora (> 1024)  | 3–4               | Completo               |

## Estados

- **Cargando:** esqueletos grises con la forma de las tarjetas, no textos de
  "cargando…".
- **Sección sin datos o con error:** la sección se oculta; el resto de la
  página sigue igual.
- **Imagen que no carga:** imagen genérica con el logo.

## Accesibilidad

- Contraste suficiente entre texto y fondo (WCAG AA).
- Todas las imágenes con `alt` descriptivo; los íconos de redes con nombre
  accesible ("Instagram de Nativa 360").
- Se puede navegar todo con teclado y el foco se ve.
- Los enlaces externos (WhatsApp, redes) abren en otra pestaña y lo indican.

## Pendientes de confirmar

- Códigos exactos de los colores y logo en alta calidad (del manual de marca
  renovado del negocio).
- Si las promociones y eventos se muestran en la landing.
- Modo oscuro: el scaffold lo trae, pero la identidad es azul y blanco. Se
  propone no incluirlo en la primera versión.
