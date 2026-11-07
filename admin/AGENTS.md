# nativa-360-admin

Panel de administración de Nativa 360. Next.js (App Router) + TypeScript.

## Documentación

Antes de construir una pantalla o una HU, leé [`docs/`](docs/):

- [`docs/requirements.md`](docs/requirements.md): roles, requisitos y reglas
  de negocio del panel.
- [`docs/system-design.md`](docs/system-design.md): rutas, estructura de
  carpetas, datos y permisos en la interfaz.
- [`docs/ui-spec.md`](docs/ui-spec.md): identidad visual y patrones de
  pantalla (lista → detalle → formulario).
- [`docs/epics/`](docs/epics/): épicas e HU-08 a HU-15 con escenarios
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
- [ ] Definir el esquema de auth del panel (probablemente Supabase Auth +
      rol admin) antes de construir pantallas reales.
- [ ] Reemplazar la página estática default por las pantallas reales del
      proyecto.
- [ ] Si hace falta cache adicional del lado del browser más allá del
      staleTime/gcTime default de TanStack Query (offline-first, Service
      Worker/PWA), evaluarlo puntualmente — no está armado todavía.
