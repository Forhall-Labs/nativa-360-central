# System design — Landing page

Source: Nativa 360 SRS, chapter IV (design). The stack and the current state
of the scaffold are in [`../AGENTS.md`](../AGENTS.md). The endpoints are in
[`../../backend/docs/system-design.md`](../../backend/docs/system-design.md).

## Place in the solution

```
Visitor (browser) ──► landing (Next.js on Vercel) ──► public API (NestJS)
       │
       ├──► e-com ("Ver tienda" button)
       ├──► WhatsApp (wa.me link)
       └──► Instagram / Facebook (links)
```

The landing page only **reads** public information from the API. It has no
session and no forms that store data. Everything it shows is managed from
`admin`.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, Vitest + Testing Library
for tests. Details in `../AGENTS.md`.

## Page and sections

A single page (`/`) with sections:

| Section               | Content                                               | Data (API)                     | Story        |
| --------------------- | ----------------------------------------------------- | ------------------------------ | ------------ |
| Header                | Logo, menu to the sections, "Ver tienda" button       | —                              | HU-19        |
| Introduction          | Who they are and what they sell                       | `GET /negocio`                 | HU-01        |
| Featured products     | Cards with name, image, description and price         | `GET /productos/destacados`    | HU-16        |
| Promotions and events | Active ones only (if confirmed for the landing page)  | `GET /promociones`, `/eventos` | HU-21        |
| Doctor visits         | Upcoming confirmed visits                             | `GET /visitas-doctor`          | HU-20        |
| Contact               | Phone, address, map, social media and WhatsApp button | `GET /negocio`                 | HU-01, HU-17 |
| Footer                | Social media and contact data                         | `GET /negocio`                 | HU-18        |

## Rendering and data

- Server-rendered with periodic revalidation (ISR), so it loads fast and is
  indexed by search engines without hitting the API on every visit.
- Each section that depends on the API works on its own: if one fails, that
  section is hidden and the rest of the page stays visible.
- The minimum contact information (phone and WhatsApp) has a fallback value
  so it is never empty.
- Images use `next/image` to be served optimized.

## Folder structure

```
src/
  app/
    page.tsx              # assembles the sections
  features/
    negocio/              # introduction, contact, footer
    destacados/
    contenido/            # promotions and events
    visitas-doctor/
  shared/
    components/
    lib/                  # API client, WhatsApp link
```

## Environment variables

| Variable               | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | API URL.                                |
| `NEXT_PUBLIC_ECOM_URL` | Online store URL ("Ver tienda" button). |

`NEXT_PUBLIC_ECOM_URL` is not in `.env.local.example` yet: it is added when
the "Ver tienda" button is implemented (HU-01). The Supabase variables in the
example are not used, because the landing page has no session.
