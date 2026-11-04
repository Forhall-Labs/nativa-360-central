# Flujo de trabajo

Este proyecto vive en la carpeta `backend/` de
[nativa-360-central](https://github.com/Forhall-Labs/nativa-360-central), que
usa **trunk-based development**: una sola rama, `main`. Ahí se abren los PRs y
corren los quality gates. Este repo es una copia que se actualiza sola al
mergear; **no se abren PRs ni se pushea acá**. El flujo completo está en el
[`AGENTS.md` del central](https://github.com/Forhall-Labs/nativa-360-central/blob/main/AGENTS.md).

1. En el central, rama corta desde `main` (`feat/…`, `fix/…`, `chore/…`) y
   linkeada al issue con `Closes Forhall-Labs/nativa-360-backend#<número>` en
   el PR.
2. Al commitear, el hook de pre-commit del central (`.githooks/pre-commit`)
   corre el lint-staged de este proyecto (Prettier, ESLint y cspell sobre lo
   staged). Si algo no pasa, el commit se cancela.
3. Si el cambio toca `src/prisma/contract.prisma`, correr
   `npm run contract:emit` y commitear `contract.json`/`contract.d.ts` junto
   con el cambio, antes de abrir el PR.
4. PR contra `main`. Tienen que pasar **CI ok** (`audit`, `format:check`,
   `spell`, `lint`, tests con cobertura, `build`, `test:e2e`, build de Docker
   y Snyk) y **PR score** (SonarQube Cloud + cobertura de las líneas
   cambiadas, mínimo 80). Merge por **squash**.
5. Al mergear, el central pushea esta carpeta al `main` de este repo y
   dispara `.github/workflows/ci.yml`: repite los checks y, si pasan,
   despliega al ambiente que diga `deploy-flags.json` del central (`dev` →
   servicio **develop** de Render, `prod` → **producción**). Los dos
   servicios de Render tienen que tener configurada la rama `main`.
6. `.github/workflows/keep-alive.yml` le pega a `/health` cada 10 minutos en
   ambos ambientes, para que el free tier de Render no los duerma por
   inactividad. Necesita la variable de entorno `RENDER_HEALTH_URL`
   configurada por ambiente (Settings → Environments → production/develop →
   Environment variables) con la URL `onrender.com` de cada servicio.

## Antes de abrir el PR

```bash
npm run audit
npm run format:check
npm run lint
npm run spell
npm run build
npm test
npm run test:e2e
```

`npm run test:cov` corre los tests con la cobertura que usa el PR score.

Si alguno falla, `npm run format` corrige lo que se pueda automáticamente.

## Seguridad de dependencias

`npm install` no rechaza paquetes con vulnerabilidades conocidas — eso no
es algo que npm soporte nativamente. Por eso el bloqueo real está en dos
puntos:

- **Local**: hook de pre-push del central (`.githooks/pre-push`, corre
  `npm run audit` si la rama toca `backend/`).
- **CI**: primer paso de los checks del backend en el central, antes de
  format/lint/build/test.

El umbral es `--audit-level=high`: bloquea `high`/`critical`, pero no
`moderate`/`low` — esas igual quedan visibles en Dependabot alerts (pestaña
Security del repo), que corre de forma continua y abre PRs automáticos, pero
no bloquean nada por sí solas.

Cuando `npm audit` marca algo:

1. Si hay un fix compatible: `npm audit fix` (sin `--force`, para no saltar
   de versión mayor sin revisar).
2. Si el paquete vulnerable es una dependencia transitiva de una herramienta
   que no corre en producción, usar `overrides` en `package.json` para
   forzar la versión parchada dentro del mismo major — no bajar el
   `audit-level` para silenciarlo.
3. Si no hay fix todavía, documentar el motivo en el commit y no bajar el
   umbral del gate.

## Estado del proyecto

Este repo es scaffolding: Prisma, Supabase, Swagger, cache (Redis con
fallback a memoria) y Zod están instalados y funcionando, pero sin un
proyecto Supabase real conectado ni modelo de datos todavía. Ver
[`AGENTS.md`](AGENTS.md) para el detalle de qué falta configurar antes de
construir features reales sobre esto.
