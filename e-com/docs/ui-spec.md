# UI spec — Online store

Source: Nativa 360 SRS, sections 2.2.4 (interface standards), 3.8.2.6
(design constraints), 3.8.3.1 (user interfaces) and 3.8.7.4 (usability and
accessibility).

## Visual identity

Shared by `landing`, `e-com` and `admin`: customers must feel it is the same
store in all three.

| Element    | Guideline                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Colors     | **Blue** as the main color, **white** background and **green** only as a light accent.         |
| Typography | One sans-serif family; hierarchy through size and weight.                                      |
| Buttons    | Primary (filled blue) for each screen's main action; secondary (blue outline).                 |
| Messages   | Success, error, warning and info each with their own color and icon, always with text.         |
| Spacing    | Consistent margins and spacing (Tailwind scale).                                               |
| Language   | UI text in Spanish (`<html lang="es">`); prices in colones with thousands separator (₡12 500). |

Colors are defined once as variables in `src/app/globals.css` and used
through Tailwind classes. Never hard-code a color in a component.

## Online store principles

- **Find things fast:** the search box is always visible in the header.
- **Always know what's in the cart:** a cart icon with the product count in
  the header of every page.
- **No surprises:** a summary is shown before placing the order, and it is
  made clear that payment and delivery are coordinated over WhatsApp.
- **Mobile first.**

## Screens

### Catalog (`/`)

- Header: logo, search box, cart icon, "Mi cuenta".
- Category filter: horizontal chips on phones, side column on desktop.
- Product card: image, name, price, "Agotado" label when out of stock and an
  "Agregar" button. With an active promotion: old price struck through and
  the new price.
- No results: "No encontramos productos para «…»" and a button to clear the
  search and filters.

### Product details (`/productos/[id]`)

- Large image, name, category, price, full description and availability.
- Quantity selector (− / +) and "Agregar al carrito" button. If unavailable,
  the button is disabled and reads "No disponible".
- After adding: a short "Agregado al carrito" notice with a "Ver carrito"
  link.

### Cart (`/carrito`)

- Product list: image, name, unit price, quantity selector, subtotal and a
  remove button.
- Estimated total at the bottom, with the note "El total final se confirma
  por WhatsApp".
- "Continuar con el pedido" button. Empty cart: message and a "Ver
  productos" button.

### Checkout (`/checkout`)

- Without a session, asks the customer to sign in or sign up and comes back
  to checkout.
- Products and total summary; customer contact data (name, phone) to
  confirm.
- "Registrar pedido" button. While sending, the button is disabled so the
  order is not duplicated.

### Placed order (`/pedidos/[id]`)

- Success message with the order code.
- Large "Coordinar por WhatsApp" button (with the message already written).
- Short explanation of the next steps: the staff confirms availability,
  payment and delivery over WhatsApp.

### My orders (`/mis-pedidos`)

- List with code, date, estimated total and status (pending, in review,
  confirmed, prepared, delivered, cancelled), each status with its color.

## Forms

- Required fields marked with `*`.
- Validation when leaving the field and on submit; the error appears under
  the field and explains how to fix it ("Ingresá un teléfono de 8 dígitos").
- What the customer typed is never cleared if something fails.

## Responsive

| Width                | Products per row | Filters          |
| -------------------- | ---------------- | ---------------- |
| Phone (< 640 px)     | 2                | Horizontal chips |
| Tablet (640–1024 px) | 3                | Horizontal chips |
| Desktop (> 1024)     | 4                | Side column      |

## States

- **Loading:** skeletons shaped like the cards.
- **Connection error:** "No pudimos cargar los productos. Revisá tu conexión
  e intentá de nuevo" with a "Reintentar" button.
- **Image fails to load:** generic image with the logo.

## Accessibility

- WCAG AA contrast; prices and buttons readable on phones.
- Images with an `alt` containing the product name.
- The quantity selector and the cart work with keyboard and screen readers
  (the − / + buttons have accessible names).
- Cart changes are announced ("3 productos en el carrito").

## Open questions

- Exact color codes and a high-quality logo.
- How a promotion is shown on the card (percentage, struck-through price or
  both).
- Which data checkout asks for if home delivery is confirmed.
