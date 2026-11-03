# Flujo de trabajo

Este proyecto vive en la carpeta de su nombre dentro de
[nativa-360-central](https://github.com/Forhall-Labs/nativa-360-central), que
usa **trunk-based development**: una sola rama, `main`. Ahí se abren los PRs y
corren los quality gates. Este repo es una copia que se actualiza sola al
mergear; **no se abren PRs ni se pushea acá**. El flujo completo está en el
[`AGENTS.md` del central](https://github.com/Forhall-Labs/nativa-360-central/blob/main/AGENTS.md).

1. En el central, rama corta desde `main` (`feat/…`, `fix/…`, `chore/…`) y
   linkeada al issue con `Closes Forhall-Labs/<repo>#<número>` en el PR.
2. Al commitear, el hook de pre-commit del central (`.githooks/pre-commit`)
   corre el lint-staged de este proyecto (Prettier, ESLint y cspell sobre lo
   staged). Si algo no pasa, el commit se cancela.
3. PR contra `main`. Tienen que pasar **CI ok** (format, spell, lint, tests
   con cobertura, build, Snyk) y **PR score** (SonarQube Cloud + cobertura de
   las líneas cambiadas, mínimo 80). Merge por **squash**.
4. Al mergear, el central pushea esta carpeta al `main` de este repo y
   dispara `.github/workflows/ci-cd.yml`: repite los checks y despliega al
   ambiente que diga `deploy-flags.json` del central (`dev` → Vercel
   Preview, `prod` → Production).

## Antes de abrir el PR

```bash
npm run format:check
npm run lint
npm run spell
npm test
npm run build
```

Si alguno falla, `npm run format` corrige lo que se pueda automáticamente.
`npm run test:cov` corre los tests con la cobertura que usa el PR score.

## Estado del proyecto

Este repo es scaffolding: TanStack Query, React Hook Form, Zod y el cliente
de Supabase están instalados y funcionando (`QueryProvider` conectado en
`src/app/layout.tsx`), pero sin un proyecto Supabase real ni pantallas de
negocio todavía. Ver [`AGENTS.md`](AGENTS.md) para el detalle de qué falta
configurar.
