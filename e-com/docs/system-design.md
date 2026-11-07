# System design — Comercio electrónico

Fuente: SRS de Nativa 360, capítulo IV (diseño). El stack y el estado actual
del scaffold están en [`../AGENTS.md`](../AGENTS.md). El modelo de datos y los
endpoints están en
[`../../backend/docs/system-design.md`](../../backend/docs/system-design.md).

## Lugar en la solución

```
Cliente (navegador) ──► e-com (Next.js en Vercel) ──► API pública (NestJS)
        │                      │
        │                      └──► Supabase Auth (cuenta del cliente)
        └──► WhatsApp (enlace wa.me, coordinación manual)
```

El e-com es la capa de presentación del cliente. Lee el catálogo de la API,
guarda el carrito en el navegador y manda el pedido final a la API, que
valida productos, precios y cantidades. WhatsApp es solo un enlace: no hay
integración.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, TanStack Query para datos
del servidor, React Hook Form + Zod para formularios, `@supabase/supabase-js`
para la cuenta del cliente, Vitest + Testing Library para tests. Detalle en
`../AGENTS.md`.

## Rutas

| Ruta                     | Pantalla                                                | Sesión | HU           |
| ------------------------ | ------------------------------------------------------- | ------ | ------------ |
| `/`                      | Catálogo con búsqueda y filtro por categoría            | No     | HU-02, HU-03 |
| `/productos/[id]`        | Detalle del producto y botón "Agregar al carrito"       | No     | HU-04, HU-05 |
| `/carrito`               | Carrito: cantidades, eliminar productos, total estimado | No     | HU-05        |
| `/checkout`              | Resumen del pedido y confirmación                       | Sí     | HU-06        |
| `/pedidos/[id]`          | Pedido registrado y botón "Coordinar por WhatsApp"      | Sí     | HU-06, HU-07 |
| `/mis-pedidos`           | Pedidos del cliente                                     | Sí     | HU-06        |
| `/ingresar`, `/registro` | Inicio de sesión y creación de cuenta                   | No     | HU-06        |

Las páginas del catálogo y del detalle se renderizan en el servidor para que
carguen rápido y se puedan indexar en buscadores.

## Estructura de carpetas

```
src/
  app/                    # rutas (App Router)
  features/
    catalogo/             # listado, búsqueda, filtros, detalle
    carrito/              # estado del carrito, totales, tests
    pedidos/              # checkout, confirmación, mis pedidos, enlace WhatsApp
    cuenta/               # ingreso y registro
  shared/
    components/
    lib/                  # cliente de la API, cliente de Supabase, formato de precios
```

## Datos y estado

- **Catálogo:** TanStack Query sobre `GET /productos`, `GET /productos/:id` y
  `GET /categorias`. La búsqueda y el filtro viven en la URL
  (`?buscar=…&categoria=…`) para poder compartir el enlace.
- **Carrito:** estado del cliente guardado en `localStorage` (no necesita
  cuenta). Guarda `producto_id` y cantidad; el precio y la disponibilidad se
  vuelven a leer de la API al mostrar el carrito y antes del checkout.
- **Pedido:** `POST /pedidos` con productos y cantidades. El total que vale
  es el que calcula el backend. Si la API responde 409 (stock insuficiente,
  RN-05), se muestra qué producto falló y se deja corregir.
- **WhatsApp:** después de registrar el pedido se arma un enlace
  `https://wa.me/<numero>?text=<mensaje>` con el código del pedido, los
  productos y el total. El número viene de `GET /negocio`. El cliente decide
  si lo envía.

## Manejo de errores

- Sin conexión con la API: mensaje claro y botón de reintentar; el carrito no
  se pierde porque está en el navegador.
- Producto que se deshabilitó mientras estaba en el carrito: se marca como no
  disponible y no se incluye en el pedido.
- Datos inválidos en el checkout: se marcan los campos con el mensaje de la
  API.

## Variables de entorno

| Variable                        | Para qué                       |
| ------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL`           | URL de la API.                 |
| `NEXT_PUBLIC_SUPABASE_URL`      | Proyecto de Supabase (cuenta). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase.     |
