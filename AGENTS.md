# Nativa 360 Central — guía para agentes y personas

Monorepo de Nativa 360. Todo el trabajo se hace acá; los 4 repos individuales
son copias que se actualizan solas al mergear. Cada carpeta tiene su propio
`AGENTS.md` con el detalle técnico de ese proyecto: leelo antes de tocarlo.

| Carpeta    | Repo individual                 | Stack           | Deploy          |
| ---------- | ------------------------------- | --------------- | --------------- |
| `admin/`   | Forhall-Labs/nativa-360-admin   | Next.js         | Vercel          |
| `backend/` | Forhall-Labs/nativa-360-backend | NestJS + Prisma | Render (Docker) |
| `e-com/`   | Forhall-Labs/nativa-360-e-com   | Next.js         | Vercel          |
| `landing/` | Forhall-Labs/nativa-360-lading  | Next.js         | Vercel          |

## Trunk-based development

Hay **una sola rama de larga vida: `main`** (el trunk). No existen `dev`,
`stage`, `release/*` ni `hotfix/*`, ni acá ni en los repos individuales.

- `main` siempre está en estado desplegable. Todo lo que entra pasó los
  quality gates.
- El trabajo se hace en **ramas cortas** que salen de `main` y vuelven a
  `main` por PR en horas o pocos días: `feat/…`, `fix/…`, `chore/…`,
  `docs/…`, `ci/…`, `refactor/…`. Una rama por cambio; se borra sola al
  mergear.
- **PRs chicos.** Si una feature es grande, se parte en varios PRs que
  entran a `main` por separado. Lo que no está listo para usuarios se deja
  apagado (detrás de un flag o sin enlazar en la UI) en vez de esperar en una
  rama larga.
- Antes de pedir review, **rebase o merge de `main`** en tu rama para que el
  PR se evalúe contra el trunk actual.
- Merge siempre por **squash**: un commit por PR en `main`, con mensaje en
  formato Conventional Commits (`feat(admin): …`, `fix(backend): …`).
- **Nadie pushea directo a `main`** (está protegido) ni a los repos
  individuales: el sync rechaza cualquier divergencia.
- Un PR puede tocar varios proyectos a la vez (por ejemplo, un endpoint en
  `backend/` y su pantalla en `admin/`): se evalúan y se despliegan juntos.

### Ciclo de un cambio

1. `git switch main && git pull` → `git switch -c feat/<algo>`.
2. Commits chicos. El pre-commit (`.githooks/pre-commit`) corre el
   lint-staged de cada proyecto tocado y el pre-push (`.githooks/pre-push`)
   el `npm audit` del backend si lo tocaste.
3. PR contra `main` con la plantilla y `Closes #123` para el issue del
   central (o `Closes Forhall-Labs/nativa-360-admin#123` si es un issue viejo
   de un repo individual).
4. Tienen que pasar los checks requeridos **CI ok** y **PR score**.
5. Squash merge → `sync.yml` publica cada carpeta en el `main` de su repo y
   dispara el deploy según `deploy-flags.json`.

## Issues y GitHub Project

El tablero es [Nativa-360-KANBAN](https://github.com/orgs/Forhall-Labs/projects/1),
linkeado al central y a los 4 repos individuales.

- Los issues nuevos se abren **en el central**, uno por HU o bug aunque toque
  varios proyectos (campo "Proyecto(s)" de la plantilla).
- `.github/workflows/ticket-id.yml` le pone el prefijo `MN360-XXXXX`
  (consecutivo compartido con los repos individuales) y lo agrega al Project
  en **Backlog**. Usa el secret de organización `PROJECT_AUTOMATION_TOKEN`
  (Projects read & write), porque el `GITHUB_TOKEN` no puede tocar Projects.
- El PR que lo resuelve lleva `Closes #<n>`: GitHub lo muestra en la tarjeta
  y cierra el issue al mergear.

## Quality gates (`.github/workflows/ci.yml`)

Corren en cada PR contra `main`:

- **Checks por proyecto**, solo de las carpetas que el PR toca:
  `format:check`, `spell`, `lint`, `test:cov` (tests con cobertura), `build`;
  en `backend/` además `audit`, `test:e2e` y build de Docker.
- **Snyk** (`dependencies`, `code`, `container`): vulnerabilidades en los
  `package-lock.json`, en el código y en la imagen del backend. Umbral:
  `medium`. Se activa con la variable `SNYK_ENABLED=true` y el secret
  `SNYK_TOKEN`.
- **SonarQube Cloud** (Automatic Analysis, check "SonarCloud Code Analysis"):
  un solo proyecto para todo el central. Exclusiones en
  `.sonarcloud.properties`.
- **CI ok**: agrega los anteriores. Es check requerido.
- **PR score**: nota 0–100 con las notas de SonarQube Cloud sobre el código
  nuevo y la cobertura de las líneas que el PR cambia. Mínimo **80**. Solo se
  calcula si pasó todo lo demás. Es check requerido. Ver
  [`docs/PR_SCORE.md`](docs/PR_SCORE.md). El comentario del PR trae un
  desglose por dimensión (seguridad, vulnerabilidades, fiabilidad,
  mantenibilidad, legibilidad, deuda técnica, duplicación y cobertura), cada
  una con sus aspectos de mejora o "ninguno". Antes de pedir merge, resolvé
  los que estén en ❌.

Nunca bajes un umbral, saltes un check ni excluyas archivos de Sonar para
que un PR pase: corregí el código o agregá tests.

## Deploy: feature flag `deploy-flags.json`

En trunk-based los ambientes no son ramas. A dónde va cada proyecto lo dice
este archivo, en la raíz del central:

```json
{ "admin": "dev", "backend": "dev", "e-com": "dev", "landing": "dev" }
```

| Valor  | Vercel (admin, e-com, landing) | Render (backend)   |
| ------ | ------------------------------ | ------------------ |
| `dev`  | Preview                        | servicio `develop` |
| `prod` | Production                     | producción         |

- Cada merge a `main` despliega los proyectos cuyo código cambió al ambiente
  que diga su flag.
- **Cambiar un flag es un PR** (pasa por los mismos gates y queda en el
  historial). Pasar un proyecto de `dev` a `prod` sin tocar su código
  **promueve** lo que ya está en `main` a producción. Volver a `dev` hace que
  los próximos merges dejen de ir a producción.
- El CI valida el archivo: tienen que estar exactamente los 4 proyectos, cada
  uno con `"dev"` o `"prod"`.
- Correr `sync.yml` a mano (Actions → Sync y deploy → Run workflow)
  re-sincroniza y despliega los 4 según sus flags.

Flujo típico de release: el proyecto está en `dev`, se mergean y prueban los
cambios en Preview/develop, y cuando QA aprueba se abre un PR que cambia su
flag a `prod`.

## Sync a los repos individuales (`.github/workflows/sync.yml`)

En cada push a `main` hace `git subtree split --prefix=<carpeta>` y lo pushea
al `main` de su repo. El split es determinístico (mismos SHA que el
historial original), así que siempre es fast-forward. Después dispara en ese
repo su workflow de deploy (`ci-cd.yml` en los frontends, `ci.yml` en el
backend) con `target` y `sha`. Ese workflow repite los checks y solo
despliega si pasan. Los secrets de Vercel y Render viven en cada repo
individual.

Si el push se rechaza (alguien commiteó directo en un repo individual), hay
que traer ese cambio al central en un PR:

```bash
git subtree pull --prefix=admin https://github.com/Forhall-Labs/nativa-360-admin.git main
```

## Reglas para agentes

- Trabajá siempre en una rama corta desde `main` actualizado; nunca commitees
  en `main` ni crees ramas de larga vida.
- No edites los repos individuales ni sus clones: todo cambio va en la
  carpeta correspondiente de este repo.
- Corré los checks del proyecto que tocaste (`npm run format:check`, `lint`,
  `spell`, `test`, `build`, dentro de su carpeta) antes de abrir el PR, y
  agregá tests para las líneas que cambies: la cobertura de esas líneas suma
  al PR score.
- No cambies `deploy-flags.json` salvo que te lo pidan explícitamente: es lo
  que decide si algo llega a producción.
- No toques los workflows de deploy de los repos individuales
  (`*/.github/workflows/`) sin revisar que sigan aceptando el
  `workflow_dispatch` con `target` y `sha` que manda `sync.yml`.
- Cada proyecto tiene su propio `package.json` y `package-lock.json`: instalá
  dependencias dentro de su carpeta (`cd admin && npm install …`).

## Configuración (una vez, como admin)

- Secret `SYNC_TOKEN`: fine-grained PAT de un admin de Forhall-Labs con
  acceso a los 4 repos individuales y permisos **Contents**, **Workflows** y
  **Actions** en Read and write.
- SonarQube Cloud: importar `Forhall-Labs/nativa-360-central` con Automatic
  Analysis y guardar su project key en la variable `SONAR_PROJECT_KEY`.
- Snyk: secret `SNYK_TOKEN` y variable `SNYK_ENABLED=true`. Para que corra en
  los PRs de Dependabot, `SNYK_TOKEN` también va como Dependabot secret.
- Render: los servicios develop y producción del backend tienen que tener
  configurada la rama `main`.
- Protección de `main`: PR obligatorio, squash, checks requeridos **CI ok** y
  **PR score**.
- Una vez por clon: `git config core.hooksPath .githooks`.
