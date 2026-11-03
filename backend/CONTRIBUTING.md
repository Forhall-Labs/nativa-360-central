# Flujo de trabajo

1. Rama nueva desde `dev`, linkeada al issue (aparece en el panel
   "Development" del issue y se cierra solo al mergear el PR):
   `gh issue develop <número> --checkout --base dev`. Si no usás `gh`, se
   puede linkear a mano con el botón "Create a branch" del issue, o
   simplemente escribiendo `Closes #<número>` en el PR (ver el template).
2. Al commitear, un hook de pre-commit (husky + lint-staged) corre Prettier,
   ESLint y cspell sobre los archivos modificados — si algo no pasa, el
   commit se cancela y hay que corregirlo antes de reintentar.
3. Al pushear, un hook de pre-push corre `npm audit --audit-level=high` — si
   agregaste una dependencia con una vulnerabilidad high/critical conocida,
   el push se cancela (ver "Seguridad de dependencias" abajo).
4. Si el cambio toca `src/prisma/contract.prisma`, correr
   `npm run contract:emit` y commitear `contract.json`/`contract.d.ts` junto
   con el cambio, antes de abrir el PR.
5. Abrí el Pull Request contra `dev` (se completa solo con el template de
   `.github/pull_request_template.md`). GitHub Actions corre `audit`,
   `format:check`, `spell`, `lint`, `build`, `test`, `test:e2e` y un build de
   la imagen Docker — tiene que quedar en verde antes de mergear.
6. Merge por **squash**: el historial de `dev`/`main` queda un commit por
   PR. La rama se borra sola al mergear.
7. Un push a `dev` dispara el deploy al ambiente **develop** en Render; un
   push a `main` dispara el deploy a **producción**
   (`.github/workflows/deploy.yml`), en ambos casos solo si la CI de esa
   rama pasó. Cuando `dev` está listo para salir, se abre un PR de `dev` →
   `main` (mismo flujo: CI verde, squash merge) — no se pushea a `main`
   directo.
8. `.github/workflows/keep-alive.yml` le pega a `/health` cada 10 minutos en
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

Si alguno falla, `npm run format` corrige lo que se pueda automáticamente.

## Seguridad de dependencias

`npm install` no rechaza paquetes con vulnerabilidades conocidas — eso no
es algo que npm soporte nativamente. Por eso el bloqueo real está en dos
puntos:

- **Local**: hook de pre-push (`npm run audit`).
- **CI**: primer paso del workflow, antes de format/lint/build/test.

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
