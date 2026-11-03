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

Dos ramas, dos ambientes en Render: `dev` → develop, `main` → producción.
Cada Pull Request corre `audit`, `format:check`, `spell`, `lint`, `build`,
`test`, `test:e2e` y un build de Docker vía GitHub Actions
(`.github/workflows/ci.yml`); cada push a esas ramas, si la CI pasa, dispara
el deploy (`.github/workflows/deploy.yml`). Ver `CONTRIBUTING.md` para el
flujo completo.
