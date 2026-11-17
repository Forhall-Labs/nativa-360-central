# System design — Online store

Source: Nativa 360 SRS, chapter IV (design). The stack and the current state
of the scaffold are in [`../AGENTS.md`](../AGENTS.md). The data model and
endpoints are in
[`../../backend/docs/system-design.md`](../../backend/docs/system-design.md).

## Place in the solution

```
Customer (browser) ──► e-com (Next.js on Vercel) ──► public API (NestJS)
        │                      │
        │                      └──► Supabase Auth (customer account)
        └──► WhatsApp (wa.me link, manual coordination)
```

The online store is the customer's presentation layer. It reads the catalog
from the API, keeps the cart in the browser and sends the final order to the
API, which validates products, prices and quantities. WhatsApp is just a
link: there is no integration.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, TanStack Query for server
data, React Hook Form + Zod for forms, `@supabase/supabase-js` for the
customer account, Vitest + Testing Library for tests. Details in
`../AGENTS.md`.

## Routes

| Route                    | Screen                                             | Session | HU                  |
| ------------------------ | -------------------------------------------------- | ------- | ------------------- |
| `/`                      | Catalog with search and category filter            | No      | HU-02, HU-03, HU-22 |
| `/productos/[id]`        | Product details and "Add to cart" button           | No      | HU-04, HU-05        |
| `/carrito`               | Cart: quantities, remove products, estimated total | No      | HU-05               |
| `/checkout`              | Order summary and confirmation                     | Yes     | HU-06, HU-23        |
| `/pedidos/[id]`          | Placed order and "Coordinate via WhatsApp" button  | Yes     | HU-07, HU-26        |
| `/mis-pedidos`           | The customer's orders                              | Yes     | HU-26               |
| `/ingresar`, `/registro` | Sign in and sign up                                | No      | HU-24, HU-25        |

Routes are in Spanish because they are visible to customers. The catalog and
product detail pages are rendered on the server so they load fast and can be
indexed by search engines.

## Folder structure

```
src/
  app/                    # routes (App Router)
  features/
    catalogo/             # listing, search, filters, details
    carrito/              # cart state, totals, tests
    pedidos/              # checkout, confirmation, my orders, WhatsApp link
    cuenta/               # sign in and sign up
  shared/
    components/
    lib/                  # API client, Supabase client, price formatting
```

## Data and state

- **Catalog:** TanStack Query over `GET /productos`, `GET /productos/:id` and
  `GET /categorias`. Search and filter live in the URL
  (`?buscar=…&categoria=…`) so the link can be shared.
- **Cart:** client state stored in `localStorage` (no account needed). It
  stores `producto_id` and quantity; price and availability are read again
  from the API when showing the cart and before checkout.
- **Order:** `POST /pedidos` with products and quantities. The total that
  counts is the one calculated by the backend. If the API returns 409 (not
  enough stock, RN-05), the store shows which product failed and lets the
  customer fix it.
- **WhatsApp:** after the order is placed, the store builds a
  `https://wa.me/<number>?text=<message>` link with the order code, products
  and total. The number comes from `GET /negocio`. The customer decides
  whether to send it.

## Error handling

- API unreachable: clear message and retry button; the cart is not lost
  because it lives in the browser.
- A product disabled while in the cart: marked as unavailable and left out
  of the order.
- Invalid checkout data: fields are marked with the API's message.

## Environment variables

| Variable                        | Purpose                     |
| ------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`           | API URL.                    |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project (account). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key.        |
