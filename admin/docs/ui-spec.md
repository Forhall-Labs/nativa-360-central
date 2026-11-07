# UI spec — Administración y gestión

Fuente: SRS de Nativa 360, secciones 2.2.4 (estándares de interfaz), 3.8.2.6
(restricciones de diseño), 3.8.3.1 (interfaces de usuario) y 3.8.7.4
(usabilidad y accesibilidad).

## Identidad visual

Común a `landing`, `e-com` y `admin`.

| Elemento   | Lineamiento                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Colores    | **Azul** como color principal, **blanco** de fondo y **verde** solo como acento (poca presencia).        |
| Tipografía | Una sola familia sans serif; jerarquía con tamaño y peso.                                                |
| Botones    | Primario (azul relleno), secundario (borde azul) y destructivo (rojo) solo para deshabilitar o cancelar. |
| Mensajes   | Éxito, error, aviso e información con color e ícono propios, siempre con texto.                          |
| Espaciado  | Márgenes y espacios uniformes (escala de Tailwind).                                                      |
| Idioma     | Español (`<html lang="es">`); precios en colones; fechas `dd/mm/aaaa`.                                   |

Los colores se definen una sola vez como variables en `src/app/globals.css` y
se usan con las clases de Tailwind.

## Principios del admin

- **Pensado para el personal de la tienda:** gente sin conocimientos
  técnicos, muchas veces atendiendo clientes al mismo tiempo. Pocas acciones
  por pantalla, textos claros, nada de jerga.
- **Todas las pantallas se parecen:** mismo esquema de lista → detalle →
  formulario, para no tener que aprender cada módulo.
- **Las acciones importantes se confirman:** deshabilitar un producto,
  cancelar un pedido o cambiar un rol piden confirmación.
- **Cada quien ve lo suyo:** el menú y los botones dependen del rol.

## Estructura general

- **Menú lateral** (en celular, se abre con un botón): Inicio, Pedidos,
  Productos, Inventario, Clientes, Contenido, Visitas del doctor, Usuarios.
  Solo aparecen las opciones que el rol puede usar.
- **Barra superior:** nombre del usuario, su rol y "Cerrar sesión".
- **Área de trabajo:** título de la pantalla, botón de acción principal
  arriba a la derecha ("Nuevo producto") y el contenido.

## Patrones de pantalla

### Lista

- Tabla con búsqueda, filtros y paginación. En celular, cada fila se muestra
  como tarjeta.
- Estado de cada registro con una etiqueta de color (activo/inactivo,
  estados del pedido).
- Lista vacía: mensaje y botón para crear el primero.

### Detalle y formulario

- Formulario en una columna, con los campos agrupados por tema.
- Campos obligatorios marcados con `*`; error debajo del campo, en lenguaje
  claro.
- Botones al final: "Guardar" (primario) y "Cancelar" (secundario). Mientras
  se guarda, el botón se desactiva.
- Al guardar: aviso "Cambios guardados" y vuelta a la lista.
- Si el usuario sale con cambios sin guardar, se le avisa.

## Pantallas por módulo

| Pantalla           | Detalles                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio             | Tarjetas con pedidos pendientes y productos con stock bajo; accesos directos.                                                                                    |
| Pedidos            | Filtros por estado, fecha y cliente. En el detalle: productos, total, datos del cliente, historial de estados y botón "Cambiar estado" con observación opcional. |
| Productos          | Lista con imagen miniatura, código, nombre, categoría, precio, existencias y estado. Formulario con vista previa de la imagen.                                   |
| Inventario         | Existencias por producto; botón "Registrar movimiento" (entrada, salida o ajuste, con motivo obligatorio).                                                       |
| Clientes           | Lista con nombre, teléfono y cantidad de pedidos; detalle con datos de contacto e historial de pedidos.                                                          |
| Contenido          | Pestañas: Información del negocio, Promociones, Eventos, Multimedia. Cada publicación muestra su vigencia.                                                       |
| Visitas del doctor | Lista por fecha; formulario con doctor, especialidad, fecha, hora de inicio y fin, descripción y estado.                                                         |
| Usuarios           | Solo administrador. Lista con nombre, correo, rol y estado; formulario para crear, cambiar rol o deshabilitar.                                                   |

Colores de los estados del pedido: pendiente (gris), en revisión (amarillo),
confirmado (azul), preparado (azul claro), entregado (verde), cancelado
(rojo). Siempre con el nombre del estado escrito, no solo el color.

## Responsivo

Se usa sobre todo en la computadora de la tienda, pero tiene que funcionar en
tableta y celular para consultas rápidas (ver un pedido, cambiar su estado,
actualizar una existencia).

## Estados

- **Cargando:** esqueletos de tabla o formulario.
- **Sin permiso:** "No tenés permiso para esta acción"; no se cambia nada.
- **Sesión vencida:** aviso y redirección a `/login`, volviendo después a la
  misma pantalla.
- **Error de conexión:** aviso con "Reintentar"; lo escrito no se pierde.

## Accesibilidad

- Contraste WCAG AA; tamaño de texto cómodo para leer en la tienda.
- Tablas con encabezados reales; formularios con `label` en cada campo.
- Todo se puede usar con teclado y el foco se ve.
- Los diálogos de confirmación atrapan el foco y se cierran con `Esc`.

## Pendientes de confirmar

- Códigos exactos de los colores y logo.
- Umbral de "stock bajo" para el inicio.
