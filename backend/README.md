# nativa-360-backend

API de Nativa 360. Ver [`AGENTS.md`](AGENTS.md) para el stack completo y el
TODO de configuración pendiente.

## Empezar

Requisitos: Node.js >= 20.9.0 y el central clonado según su
[`README.md`](../README.md#setup-local) (hooks y saltos de línea LF).

```bash
npm ci
cp .env.example .env
npm run start:dev
```

Abrí [http://localhost:3000](http://localhost:3000) (hello world),
[http://localhost:3000/health](http://localhost:3000/health) y
[http://localhost:3000/docs](http://localhost:3000/docs) (Swagger).

Todas las variables de `.env` son opcionales por ahora
(`src/config/env.validation.ts`): con los valores de ejemplo la app levanta
sin Supabase ni Redis. Si un frontend local va a llamar a la API, su origen
tiene que estar en `ALLOWED_ORIGINS` (por ejemplo
`http://localhost:3001,http://localhost:3002,http://localhost:3003`).

### Particularidades

- `npm run lint` corre ESLint con `--fix`, así que puede modificar archivos.
  Para solo verificar: `npx eslint "{src,test}/**/*.ts"`.
- **Windows:** `npm test` y `npm run test:e2e` fallan con
  `SyntaxError: missing ) after argument list`, porque el script llama a
  `node_modules/.bin/jest`, que en Windows es un script de shell. Mientras
  tanto, en PowerShell:

  ```powershell
  $env:NODE_OPTIONS = "--experimental-vm-modules"
  npx jest                                # unit
  npx jest --config ./test/jest-e2e.json  # e2e
  ```

  En Git Bash, WSL, macOS, Linux y el CI los scripts funcionan normal.

## Scripts

| Comando                | Qué hace                                         |
| ---------------------- | ------------------------------------------------ |
| `npm run start:dev`    | Servidor de desarrollo (watch)                   |
| `npm run build`        | Build de producción (incluye chequeo de tipos)   |
| `npm run lint`         | ESLint (con `--fix`)                             |
| `npm run format`       | Aplica formato con Prettier                      |
| `npm run format:check` | Verifica formato sin modificar archivos          |
| `npm run spell`        | Chequeo ortográfico (`cspell`, español + inglés) |
| `npm run audit`        | Audita dependencias (falla en high/critical)     |
| `npm test`             | Unit tests (Jest)                                |
| `npm run test:e2e`     | Tests end-to-end (Jest + Supertest)              |

## CI/CD

Trunk-based: el código se trabaja en la carpeta `backend/` de
[nativa-360-central](https://github.com/Forhall-Labs/nativa-360-central), donde
cada PR contra `main` pasa por los quality gates (CI, Snyk, SonarQube Cloud y
PR score). Al mergear, el central pushea a `main` de este repo y dispara
`.github/workflows/ci.yml`, que repite `audit`, `format:check`, `spell`,
`lint`, `build`, `test`, `test:e2e` y el build de Docker, y despliega a
Render develop (`dev`) o producción (`prod`) según el feature flag
`deploy-flags.json` del central. Ver `CONTRIBUTING.md`.
