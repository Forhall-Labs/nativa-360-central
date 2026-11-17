# nativa-360-admin

Panel de administración de Nativa 360. Ver [`AGENTS.md`](AGENTS.md) para el
stack completo y el TODO de configuración pendiente.

## Empezar

Requisitos: Node.js >= 20.9.0 y el central clonado según su
[`README.md`](../README.md#setup-local) (hooks y saltos de línea LF).

```bash
npm ci
cp .env.local.example .env.local
npm run dev -- -p 3001
```

Abrí [http://localhost:3001](http://localhost:3001). Usamos el puerto 3001
para no chocar con el backend (3000), que es a donde apunta
`NEXT_PUBLIC_API_URL`. Sin otros proyectos corriendo, `npm run dev` solo
levanta en 3000.

Las variables de Supabase pueden quedar vacías hasta que exista el proyecto
real (ver TODO en `AGENTS.md`).

`next dev` agrega un bloque de reglas para agentes a `AGENTS.md` si no lo
tiene: si aparece ese cambio, va en el mismo commit que tu trabajo.

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
