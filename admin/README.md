# nativa-360-admin

Panel de administración de Nativa 360. Ver [`AGENTS.md`](AGENTS.md) para el
stack completo y el TODO de configuración pendiente.

## Empezar

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando                | Qué hace                                         |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Servidor de desarrollo                           |
| `npm run build`        | Build de producción (incluye chequeo de tipos)   |
| `npm run lint`         | ESLint                                           |
| `npm run format`       | Aplica formato con Prettier                      |
| `npm run format:check` | Verifica formato sin modificar archivos          |
| `npm run spell`        | Chequeo ortográfico (`cspell`, español + inglés) |
| `npm test`             | Tests (Vitest + Testing Library)                 |

## CI/CD

Trunk-based: el código se trabaja en la carpeta de este proyecto dentro de
[nativa-360-central](https://github.com/Forhall-Labs/nativa-360-central), donde
cada PR contra `main` pasa por los quality gates (CI, Snyk, SonarQube Cloud y
PR score). Al mergear, el central pushea a `main` de este repo y dispara
`.github/workflows/ci-cd.yml`, que repite los checks y despliega a Vercel
Preview (`dev`) o Production (`prod`) según el feature flag
`deploy-flags.json` del central. Ver `CONTRIBUTING.md`.
