# nativa-360-e-com

Frontend de e-commerce de Nativa 360. Next.js (App Router) + TypeScript.

## Documentación

Antes de construir una pantalla o una HU, leé [`docs/`](docs/):

- [`docs/requirements.md`](docs/requirements.md): requisitos y reglas de
  negocio del comercio electrónico.
- [`docs/system-design.md`](docs/system-design.md): rutas, carrito, registro
  de pedidos y enlace de WhatsApp.
- [`docs/ui-spec.md`](docs/ui-spec.md): identidad visual y comportamiento de
  cada pantalla del flujo de compra.
- [`docs/epics/`](docs/epics/): épicas e HU-02 a HU-07 con escenarios
  Gherkin. Cada escenario es un criterio de aceptación y necesita su test.

La contraparte de cada HU en la API está en
[`../backend/docs/`](../backend/docs/). El índice de todo el proyecto está en
el `docs/README.md` del repo central. Si cambia una regla o un escenario,
actualizá el documento en el mismo PR.

## Stack

- **Next.js** (App Router) + TypeScript + **Tailwind CSS**.
- **TanStack Query** (`src/shared/components/QueryProvider.tsx`, conectado
  en `src/app/layout.tsx`) para data fetching/cache del lado del cliente.
- **React Hook Form** + **Zod** + `@hookform/resolvers` para formularios,
  listos para usarse en cuanto haya pantallas reales.
- **Supabase** (`@supabase/supabase-js`, `src/shared/lib/supabase-client.ts`)
  — cliente browser armado, sin proyecto real conectado todavía.
- **ESLint** (`eslint-config-next`) + **Prettier**
  (`prettier-plugin-tailwindcss`) + **cspell** + **Husky/lint-staged**
  (pre-commit).
- **Vitest** + Testing Library + jsdom para tests.

Hoy el único código real es la página estática default de `create-next-app`.

## TODO — antes de construir features reales

- [ ] Crear el proyecto real en Supabase y cargar
      `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` en
      `.env.local` (local) y en las env vars del proyecto en Vercel.
- [ ] Apuntar `NEXT_PUBLIC_API_URL` a `nativa-360-backend` una vez esté
      deployado.
- [ ] Crear el repo remoto en GitHub, hacer `vercel link` y cargar
      `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` como secrets
      (Settings → Secrets → Actions) para que `ci-cd.yml` pueda deployar.
- [ ] Reemplazar la página estática default por las pantallas reales del
      proyecto.
- [ ] Si hace falta cache adicional del lado del browser más allá del
      staleTime/gcTime default de TanStack Query (offline-first, Service
      Worker/PWA), evaluarlo puntualmente — no está armado todavía.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
