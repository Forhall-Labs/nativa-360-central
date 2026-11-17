# System design — Administration panel

Source: Nativa 360 SRS, chapter IV (design). The stack and the current state
of the scaffold are in [`../AGENTS.md`](../AGENTS.md). The data model and
endpoints are in
[`../../backend/docs/system-design.md`](../../backend/docs/system-design.md).

## Place in the solution

```
Staff (browser) ──► admin (Next.js on Vercel) ──► API /admin/* (NestJS)
                          │
                          └──► Supabase Auth (sign in and sign out)
```

The admin panel is the staff's presentation layer. It has no business logic
of its own and no direct database access: everything goes through the API,
which enforces permissions and rules. The panel hides what a role cannot do
for a better experience, but it does not replace backend validation.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, TanStack Query for server
data, React Hook Form + Zod for forms, `@supabase/supabase-js` for the
session, Vitest + Testing Library for tests. Details in `../AGENTS.md`.

## Routes

All of them require a session, except `/login`.

| Route                    | Screen                                                    | Roles                           | HU              |
| ------------------------ | --------------------------------------------------------- | ------------------------------- | --------------- |
| `/login`                 | Sign in                                                   | All                             | HU-34           |
| `/`                      | Home: pending orders and low-stock summary                | All                             | —               |
| `/productos`             | Product list, search and filter                           | Administrator, employee         | HU-08           |
| `/productos/nuevo`       | Register a product                                        | Administrator                   | HU-08           |
| `/productos/[id]`        | Edit, change image or disable                             | Administrator (price only them) | HU-08, HU-28    |
| `/productos/categorias`  | Product categories                                        | Administrator                   | HU-27           |
| `/inventario`            | Stock and entries, exits and adjustments                  | Administrator, employee         | HU-09           |
| `/pedidos`               | Order list with status, date and customer filters         | Administrator, employee         | HU-10, HU-12    |
| `/pedidos/[id]`          | Order details, status, payment, discount and cancellation | Administrator, employee         | HU-10, HU-29–31 |
| `/clientes`              | Customer list                                             | Administrator, employee         | HU-11           |
| `/clientes/[id]`         | Contact data and order history                            | Administrator, employee         | HU-11, HU-12    |
| `/contenido/negocio`     | Business information shown on the landing page            | Administrator                   | HU-32           |
| `/contenido/promociones` | Promotions                                                | Administrator, authorized       | HU-13           |
| `/contenido/eventos`     | Events                                                    | Administrator, authorized       | HU-13           |
| `/contenido/multimedia`  | Images and videos                                         | Administrator, authorized       | HU-33           |
| `/visitas-doctor`        | Doctor visits                                             | Administrator, authorized       | HU-14           |
| `/usuarios`              | Internal users and roles                                  | Administrator only              | HU-15           |

Routes are in Spanish because they are visible to users in the address bar.

## Folder structure

Organized by module (SRS 2.2.2): each domain groups its components, data
hooks, schemas and tests.

```
src/
  app/                    # routes (App Router): they only assemble the page
    (auth)/login/
    (panel)/              # layout with side menu and session guard
      productos/  inventario/  pedidos/  clientes/
      contenido/  visitas-doctor/  usuarios/
  features/
    productos/            # components, useProductos(), Zod schema, tests
    inventario/
    pedidos/
    clientes/
    contenido/
    visitas-doctor/
    usuarios/
    auth/                 # session, current role, <RequiereRol>
  shared/
    components/           # buttons, tables, forms, messages
    lib/                  # API client, Supabase client
```

## Data and state

- **Server data:** TanStack Query. One hook per operation (`useProductos`,
  `useActualizarEstadoPedido`, …) that calls the API client in `shared/lib`.
  The matching query is invalidated after every change.
- **Forms:** React Hook Form + Zod. Schemas mirror the backend rules
  (required fields, end dates after start dates) to warn before submitting.
- **Session:** Supabase Auth in the browser. The JWT is sent on every API call
  (`Authorization: Bearer`). The API returns the user's role.

## Permissions in the UI

- The panel layout redirects to `/login` when there is no session.
- Menu items and buttons depend on the role (for example, employees do not
  see an editable price field or `/usuarios`).
- If the API returns 403, the panel shows "No tenés permiso para esta
  acción" and nothing changes on screen.

## Error handling

- 400: mark the fields with the message returned by the API.
- 401: expired session → redirect to `/login`.
- 409: show the conflict message (duplicate code, not enough stock).
- Network error or 503: "could not connect" notice with a retry button; what
  the user typed is not lost.

## Environment variables

| Variable                        | Purpose                     |
| ------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`           | API URL.                    |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project (session). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key.        |
