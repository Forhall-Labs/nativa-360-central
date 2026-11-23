# UI spec — Administration panel

Source: Nativa 360 SRS, sections 2.2.4 (interface standards), 3.8.2.6
(design constraints), 3.8.3.1 (user interfaces) and 3.8.7.4 (usability and
accessibility).

## Visual identity

Shared by `landing`, `e-com` and `admin`.

| Element    | Guideline                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------ |
| Colors     | **Blue** as the main color, **white** background and **green** only as a light accent.           |
| Typography | One sans-serif family; hierarchy through size and weight.                                        |
| Buttons    | Primary (filled blue), secondary (blue outline) and destructive (red) only to disable or cancel. |
| Messages   | Success, error, warning and info each with their own color and icon, always with text.           |
| Spacing    | Consistent margins and spacing (Tailwind scale).                                                 |
| Language   | UI text in Spanish (`<html lang="es">`); prices in colones; dates as `dd/mm/aaaa`.               |

Colors are defined once as variables in `src/app/globals.css` and used
through Tailwind classes.

## Admin panel principles

- **Built for the store staff:** non-technical people, often serving
  customers at the same time. Few actions per screen, clear texts, no
  jargon.
- **Every screen looks alike:** the same list → detail → form pattern, so no
  module has to be learned from scratch.
- **Important actions are confirmed:** disabling a product, cancelling an
  order or changing a role asks for confirmation.
- **Everyone sees what's theirs:** the menu and buttons depend on the role.

## General layout

- **Side menu** (on phones it opens with a button): Inicio, Pedidos,
  Productos, Inventario, Clientes, Contenido, Visitas del doctor, Usuarios.
  Only the options the role can use are shown.
- **Top bar:** user name, role and "Cerrar sesión".
- **Work area:** screen title, main action button at the top right ("Nuevo
  producto") and the content.

## Screen patterns

### List

- Table with search, filters and pagination. On phones, each row is shown
  as a card.
- Each record's status as a colored label (active/inactive, order
  statuses).
- Empty list: message and a button to create the first one.

### Detail and form

- Single-column form, with fields grouped by topic.
- Required fields marked with `*`; the error goes under the field, in plain
  language.
- Buttons at the bottom: "Guardar" (primary) and "Cancelar" (secondary).
  While saving, the button is disabled.
- After saving: "Cambios guardados" notice and back to the list.
- If the user leaves with unsaved changes, they are warned.

## Screens by module

| Screen        | Details                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home          | Cards with pending orders and low-stock products; shortcuts.                                                                                       |
| Orders        | Filters by status, date and customer. Details: products, total, customer data, status history and a "Cambiar estado" button with an optional note. |
| Products      | List with thumbnail, code, name, category, price, stock and status. Form with an image preview.                                                    |
| Inventory     | Stock per product; "Registrar movimiento" button (entry, exit or adjustment, with a required reason).                                              |
| Customers     | List with name, phone and number of orders; details with contact data and order history.                                                           |
| Content       | Tabs: business information, promotions, events, media. Each publication shows its validity.                                                        |
| Doctor visits | List by date; form with doctor, specialty, date, start and end time, description and status.                                                       |
| Users         | Administrator only. List with name, email, role and status; form to create, change role or disable.                                                |

Order status colors: pending (grey), in review (yellow), confirmed (blue),
prepared (light blue), delivered (green), cancelled (red). Always with the
status name written, never color alone.

## Responsive

Mostly used on the store's computer, but it must work on tablets and phones
for quick tasks (check an order, change its status, update stock).

## States

- **Loading:** table or form skeletons.
- **No permission:** "No tenés permiso para esta acción"; nothing changes.
- **Expired session:** notice and redirect to `/login`, coming back to the
  same screen afterwards.
- **Connection error:** notice with "Reintentar"; what was typed is not
  lost.

## Accessibility

- WCAG AA contrast; comfortable text size for reading in the store.
- Tables with real headers; forms with a `label` on every field.
- Everything works with the keyboard and the focus is visible.
- Confirmation dialogs trap focus and close with `Esc`.

## Open questions

- Exact color codes and logo.
- Low-stock threshold for the home screen.
