# UI spec — Comercio electrónico

Fuente: SRS de Nativa 360, secciones 2.2.4 (estándares de interfaz), 3.8.2.6
(restricciones de diseño), 3.8.3.1 (interfaces de usuario) y 3.8.7.4
(usabilidad y accesibilidad).

## Identidad visual

Común a `landing`, `e-com` y `admin`: el cliente tiene que sentir que es el
mismo negocio en los tres.

| Elemento   | Lineamiento                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Colores    | **Azul** como color principal, **blanco** de fondo y **verde** solo como acento (poca presencia). |
| Tipografía | Una sola familia sans serif; jerarquía con tamaño y peso.                                         |
| Botones    | Primario (azul relleno) para la acción principal de cada pantalla; secundario (borde azul).       |
| Mensajes   | Éxito, error, aviso e información con color e ícono propios, siempre con texto.                   |
| Espaciado  | Márgenes y espacios uniformes (escala de Tailwind).                                               |
| Idioma     | Español (`<html lang="es">`); precios en colones con separador de miles (₡12 500).                |

Los colores se definen una sola vez como variables en `src/app/globals.css` y
se usan con las clases de Tailwind. Nunca se escribe un color a mano en un
componente.

## Principios del e-commerce

- **Encontrar rápido:** el buscador está siempre visible en el encabezado.
- **Saber siempre qué hay en el carrito:** ícono con la cantidad de productos
  en el encabezado de todas las páginas.
- **Sin sorpresas:** antes de registrar el pedido se muestra un resumen, y se
  aclara que el pago y la entrega se coordinan por WhatsApp.
- **Primero el celular.**

## Pantallas

### Catálogo (`/`)

- Encabezado: logo, buscador, ícono del carrito, "Mi cuenta".
- Filtro por categoría: chips horizontales en celular, columna lateral en
  computadora.
- Tarjeta de producto: imagen, nombre, precio, etiqueta "Agotado" si no hay
  existencias y botón "Agregar". Si tiene promoción vigente: precio anterior
  tachado y precio nuevo.
- Sin resultados: "No encontramos productos para «…»" y un botón para limpiar
  la búsqueda y los filtros.

### Detalle del producto (`/productos/[id]`)

- Imagen grande, nombre, categoría, precio, descripción completa y
  disponibilidad.
- Selector de cantidad (− / +) y botón "Agregar al carrito". Si no está
  disponible, el botón se desactiva y dice "No disponible".
- Al agregar: aviso breve "Agregado al carrito" con enlace "Ver carrito".

### Carrito (`/carrito`)

- Lista de productos: imagen, nombre, precio unitario, selector de cantidad,
  subtotal y botón para eliminar.
- Total estimado al final, con la nota "El total final se confirma por
  WhatsApp".
- Botón "Continuar con el pedido". Carrito vacío: mensaje y botón "Ver
  productos".

### Checkout (`/checkout`)

- Si no hay sesión, pide ingresar o crear cuenta y vuelve al checkout.
- Resumen de productos y total; datos de contacto del cliente (nombre,
  teléfono) para confirmar.
- Botón "Registrar pedido". Mientras se envía, el botón se desactiva para no
  duplicar el pedido.

### Pedido registrado (`/pedidos/[id]`)

- Mensaje de éxito con el código del pedido.
- Botón grande "Coordinar por WhatsApp" (con el mensaje ya armado).
- Explicación corta de los próximos pasos: el personal confirma
  disponibilidad, pago y entrega por WhatsApp.

### Mis pedidos (`/mis-pedidos`)

- Lista con código, fecha, total estimado y estado (pendiente, en revisión,
  confirmado, preparado, entregado, cancelado), cada estado con su color.

## Formularios

- Campos obligatorios marcados con `*`.
- Validación al salir del campo y al enviar; el error aparece debajo del
  campo y dice cómo corregirlo ("Ingresá un teléfono de 8 dígitos").
- Nunca se borra lo que el cliente escribió si algo falla.

## Responsivo

| Ancho                 | Productos por fila | Filtros            |
| --------------------- | ------------------ | ------------------ |
| Celular (< 640 px)    | 2                  | Chips horizontales |
| Tableta (640–1024 px) | 3                  | Chips horizontales |
| Computadora (> 1024)  | 4                  | Columna lateral    |

## Estados

- **Cargando:** esqueletos con la forma de las tarjetas.
- **Error de conexión:** "No pudimos cargar los productos. Revisá tu conexión
  e intentá de nuevo" con botón "Reintentar".
- **Imagen que no carga:** imagen genérica con el logo.

## Accesibilidad

- Contraste WCAG AA; precios y botones legibles en celular.
- Imágenes con `alt` con el nombre del producto.
- El selector de cantidad y el carrito se usan con teclado y lector de
  pantalla (los botones − / + tienen nombre accesible).
- Los cambios del carrito se anuncian ("3 productos en el carrito").

## Pendientes de confirmar

- Códigos exactos de los colores y logo en alta calidad.
- Cómo se muestra una promoción en la tarjeta (porcentaje, precio tachado o
  ambos).
- Qué datos se piden en el checkout si se confirman las entregas a domicilio.
