# Nativa 360 Central

Repo central (monorepo) de Nativa 360, con **trunk-based development**: una
sola rama, `main`. Todo el trabajo se hace acá; los 4 repos individuales se
actualizan solos cuando se mergea un PR.

| Carpeta    | Repo individual                                                          |
| ---------- | ------------------------------------------------------------------------ |
| `admin/`   | [nativa-360-admin](https://github.com/Forhall-Labs/nativa-360-admin)     |
| `backend/` | [nativa-360-backend](https://github.com/Forhall-Labs/nativa-360-backend) |
| `e-com/`   | [nativa-360-e-com](https://github.com/Forhall-Labs/nativa-360-e-com)     |
| `landing/` | [nativa-360-lading](https://github.com/Forhall-Labs/nativa-360-lading)   |

Cada carpeta tiene el historial completo de su repo (importado con
`git subtree`), su propio `package.json`, `README.md`, `CONTRIBUTING.md` y
`AGENTS.md`.

## Flujo resumido

1. Rama corta desde `main` → PR contra `main`.
2. Quality gates: **CI ok** (checks por proyecto, Snyk) y **PR score**
   (SonarQube Cloud + cobertura de líneas cambiadas, mínimo 80).
3. Squash merge → `sync.yml` pushea cada carpeta al `main` de su repo y
   dispara el deploy a `dev` o `prod` según el feature flag
   [`deploy-flags.json`](deploy-flags.json).

El detalle (reglas de trunk-based, gates, flags de deploy, sync y
configuración) está en [`AGENTS.md`](AGENTS.md); la fórmula del PR score en
[`docs/PR_SCORE.md`](docs/PR_SCORE.md).

## Setup local

### Requisitos

- **Node.js >= 20.9.0** (lo piden los 4 `package.json`; probado con Node 24)
  y npm.
- Git. En **Windows**, el repo tiene que quedar con saltos de línea LF: si
  Git convierte a CRLF, `npm run format:check` falla en todos los archivos.

### 1. Clonar y activar los hooks

```bash
git clone -c core.autocrlf=input https://github.com/Forhall-Labs/nativa-360-central.git
cd nativa-360-central
git config core.hooksPath .githooks   # pre-commit y pre-push por proyecto
```

`-c core.autocrlf=input` deja el clon en LF aunque Git esté instalado con
`autocrlf=true` (el default en Windows). Si ya clonaste sin esa opción y
`format:check` falla en todos los archivos, corregilo una vez (con el árbol
sin cambios pendientes):

```bash
git config core.autocrlf input
git rm -r --cached -q . && git reset --hard
```

### 2. Instalar dependencias

Cada proyecto tiene su propio `package.json` y `package-lock.json`. Usá
`npm ci`: instala exactamente lo que dice el lockfile, igual que el CI.

```bash
(cd admin && npm ci)
(cd backend && npm ci)
(cd e-com && npm ci)
(cd landing && npm ci)
```

`npm install <paquete>` solo para agregar o actualizar una dependencia.
Necesitás unos 2 GB libres para los 4 `node_modules`.

### 3. Variables de entorno

```bash
cp backend/.env.example backend/.env
cp admin/.env.local.example admin/.env.local
cp e-com/.env.local.example e-com/.env.local
cp landing/.env.local.example landing/.env.local
```

Con los valores de ejemplo los 4 proyectos levantan: todavía no hay proyecto
de Supabase real, y las variables de Supabase, base de datos y Redis son
opcionales por ahora. Los `.env` están en `.gitignore`: nunca los commitees.

### 4. Levantar los proyectos

Los 4 usan el puerto 3000 por defecto. Para correrlos a la vez, el backend
queda en 3000 (es lo que esperan los `NEXT_PUBLIC_API_URL` de ejemplo) y cada
frontend en su propio puerto:

| Proyecto  | Comando (dentro de la carpeta) | URL                                                       |
| --------- | ------------------------------ | --------------------------------------------------------- |
| `backend` | `npm run start:dev`            | http://localhost:3000/health · http://localhost:3000/docs |
| `admin`   | `npm run dev -- -p 3001`       | http://localhost:3001                                     |
| `e-com`   | `npm run dev -- -p 3002`       | http://localhost:3002                                     |
| `landing` | `npm run dev -- -p 3003`       | http://localhost:3003                                     |

Si un frontend va a llamar al backend, agregá su origen a `ALLOWED_ORIGINS`
en `backend/.env` (por ejemplo
`http://localhost:3001,http://localhost:3002,http://localhost:3003`).

`next dev` agrega un bloque de reglas para agentes al `AGENTS.md` de cada
frontend si no lo tiene. Si te aparece ese cambio, commitealo junto con tu
trabajo.

### 5. Verificar

En cada proyecto, los mismos checks que corre el CI:

```bash
npm run format:check
npm run spell
npm run lint
npm test
npm run build   # también es el typecheck: falla si hay errores de tipos
```

En `backend/` además `npm run test:e2e`. Ojo: el `npm run lint` del backend
corre con `--fix` y puede modificar archivos. Detalles y particularidades de
cada proyecto en su `README.md`.

## Cómo llevar un cambio a producción

1. Rama corta desde `main` actualizado, con prefijo según el tipo de cambio
   (`feat/`, `fix/`, `chore/`, `docs/`, `ci/`, `refactor/`):

   ```bash
   git switch main && git pull
   git switch -c feat/mi-cambio
   ```

2. Commits chicos. El hook `pre-commit` corre el lint-staged de cada proyecto
   que tocaste y el `pre-push` el `npm audit` del backend si lo tocaste.
3. Antes de pedir review, traé lo último de `main` (`git pull --rebase
origin main`) y corré los checks del paso 5 en cada proyecto que tocaste.
4. `git push -u origin feat/mi-cambio` y abrí el PR contra `main` con la
   plantilla, incluyendo `Closes #<n>` del issue del central.
5. Tienen que pasar **CI ok** y **PR score** (mínimo 80). Revisá el
   comentario del PR score y resolvé lo que esté en ❌.
6. Squash merge. El commit en `main` usa Conventional Commits
   (`feat(admin): …`, `fix(backend): …`).
7. Al mergear, `sync.yml` hace `git subtree split` de cada carpeta y la
   pushea al `main` de su repo individual. Ese repo repite los checks y
   despliega a `dev` o `prod` según [`deploy-flags.json`](deploy-flags.json).
   Nunca commitees directo en `main` ni en los repos individuales.
