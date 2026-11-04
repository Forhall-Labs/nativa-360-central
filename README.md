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

```bash
git clone https://github.com/Forhall-Labs/nativa-360-central.git
cd nativa-360-central
git config core.hooksPath .githooks   # pre-commit y pre-push por proyecto
cd admin && npm install                # en cada proyecto que vayas a tocar
```
