# nativa-360-backend

API de Nativa 360. NestJS + TypeScript, pensado para correr contra Postgres
(Supabase) vía Prisma.

## Stack

- **NestJS** (Express) + TypeScript estricto (`strict`,
  `noUncheckedIndexedAccess`, etc. en `tsconfig.json`).
- **Prisma Next** (`src/prisma/contract.prisma`, editar y correr
  `npm run contract:emit`) + extensión de Supabase
  (`@prisma/orm-extension-supabase`) para las queries a la base, más
  **`@supabase/supabase-js`** (`src/supabase/`) para todo lo que no es DB
  (Auth admin, Storage, Realtime). Ambos clientes se arman perezosamente —
  la app arranca sin credenciales reales, y solo tiran error si algo los usa
  de verdad (ver TODO).
- **Swagger** (`@nestjs/swagger`) — documentación de la API en `/docs`.
- **Zod** (`zod` + `nestjs-zod`) — validación de DTOs.
- **Cache** (`@nestjs/cache-manager`) — usa Redis si `REDIS_URL` está seteada,
  si no cae a memoria.
- **ESLint** (typescript-eslint strict + `eslint-plugin-security`) +
  **Prettier** + **cspell** + **Husky/lint-staged** (pre-commit) +
  `npm audit` (pre-push).
- **Jest** para unit e2e tests, **Docker** multi-stage para producción.

Hoy el único código real es el scaffold: `GET /` (hello world) y
`GET /health` (`{status:"ok"}`).

## TODO — antes de construir features reales

- [ ] Crear el proyecto real en Supabase y cargar `DATABASE_URL`,
      `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` en
      `.env` (local) y en las env vars del servicio en Render.
      `SUPABASE_JWKS_URL` es opcional (se deriva de `SUPABASE_URL` si no se
      setea).
- [ ] Modelar `src/prisma/contract.prisma` según los requerimientos reales
      del proyecto y correr `npm run contract:emit` (commitear
      `contract.json` + `contract.d.ts` junto con el cambio).
- [ ] Decidir si Redis es necesario ahora o si memoria alcanza por un tiempo;
      si se provisiona, setear `REDIS_URL`.
- [ ] Crear el repo remoto en GitHub y cargar los secrets que ya esperan los
      workflows: `RENDER_DEPLOY_HOOK_URL_PRODUCTION`,
      `RENDER_DEPLOY_HOOK_URL_DEVELOP` (Settings → Secrets), y
      `RENDER_HEALTH_URL` por ambiente (Settings → Environments).
- [ ] Extender `GET /health` (`src/health/health.controller.ts`) para
      chequear la conexión real a la base una vez esté conectada.
- [ ] Definir el esquema de auth (probablemente JWT de Supabase Auth, como en
      otros proyectos del equipo) y agregar el guard correspondiente.
- [ ] Reemplazar `AppController`/`AppService` por los módulos de dominio
      reales del proyecto.
