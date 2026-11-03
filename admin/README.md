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

Tres ramas, tres ambientes en Vercel: `dev` → preview, `stage` → preview
(QA), `main` → producción. Cada Pull Request corre `format:check`, `spell`,
`lint`, `test` y `build` vía GitHub Actions; cada push a esas ramas, si los
checks pasan, además dispara el deploy al ambiente correspondiente
(`.github/workflows/ci-cd.yml`). Ver `CONTRIBUTING.md` para el flujo
completo.
