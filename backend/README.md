# nativa-360-backend

API de Nativa 360. Ver [`AGENTS.md`](AGENTS.md) para el stack completo y el
TODO de configuración pendiente.

## Empezar

```bash
npm install
cp .env.example .env
npm run start:dev
```

Abrí [http://localhost:3000](http://localhost:3000) (hello world) y
[http://localhost:3000/docs](http://localhost:3000/docs) (Swagger).

## Scripts

| Comando                | Qué hace                                         |
| ---------------------- | ------------------------------------------------ |
| `npm run start:dev`    | Servidor de desarrollo (watch)                   |
| `npm run build`        | Build de producción (incluye chequeo de tipos)   |
| `npm run lint`         | ESLint                                           |
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
