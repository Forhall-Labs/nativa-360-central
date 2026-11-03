# Flujo de trabajo

Tres ramas — cada una con su propio deploy en Vercel:

| Rama    | Target Vercel | Qué es                                    |
| ------- | ------------- | ----------------------------------------- |
| `dev`   | Preview       | Integración diaria, sin revisión de QA    |
| `stage` | Preview       | QA — lo que se prueba antes de producción |
| `main`  | Production    | Lo que ven los usuarios reales            |

1. Rama nueva desde `dev`, linkeada al issue (aparece en el panel
   "Development" del issue y se cierra solo al mergear el PR):
   `gh issue develop <número> --checkout --base dev`. Si no usás `gh`, se
   puede linkear a mano con el botón "Create a branch" del issue, o
   simplemente escribiendo `Closes #<número>` en el PR (ver el template).
2. Al commitear, un hook de pre-commit (husky + lint-staged) corre Prettier,
   ESLint y cspell sobre los archivos modificados — si algo no pasa, el
   commit se cancela y hay que corregirlo antes de reintentar.
3. PR contra `dev` (se completa solo con el template de
   `.github/pull_request_template.md`). GitHub Actions corre `format:check`,
   `spell`, `lint`, `test` y `build` — tiene que quedar en verde antes de
   mergear. Al mergear, el push a `dev` dispara un deploy Preview.
4. Cuando `dev` está estable, PR de `dev` → `stage`. Al mergear, otro deploy
   Preview — ahí es donde QA prueba antes de dejarlo pasar.
5. Una vez aprobado en `stage`, PR de `stage` → `main`. Al mergear, deploy
   automático a producción.

Merge siempre por **squash**; la rama de origen se borra sola.

## Antes de abrir el PR

```bash
npm run format:check
npm run lint
npm run spell
npm test
npm run build
```

Si alguno falla, `npm run format` corrige lo que se pueda automáticamente.

## Notas sobre el deploy

`.github/workflows/ci-cd.yml` tiene un solo workflow con dos jobs: `checks`
(siempre) y `deploy` (`needs: checks`, solo en push a `dev`/`stage`/`main`)
— así un build roto nunca llega a ningún ambiente. `main` deploya con
`--target=production`; `dev`/`stage` con `--target=preview`.

## Estado del proyecto

Este repo es scaffolding: TanStack Query, React Hook Form, Zod y el cliente
de Supabase están instalados y funcionando (`QueryProvider` conectado en
`src/app/layout.tsx`), pero sin un proyecto Supabase real ni pantallas de
negocio todavía. Ver [`AGENTS.md`](AGENTS.md) para el detalle de qué falta
configurar.
