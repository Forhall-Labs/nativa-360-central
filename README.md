# Nativa 360 Central

Repo central (monorepo) de Nativa 360. Todo el trabajo se hace acá; los 4
repos individuales se actualizan solos cuando se mergea un PR.

| Carpeta    | Repo individual                                                          | Ramas sincronizadas |
| ---------- | ------------------------------------------------------------------------ | ------------------- |
| `admin/`   | [nativa-360-admin](https://github.com/Forhall-Labs/nativa-360-admin)     | dev, stage, main    |
| `backend/` | [nativa-360-backend](https://github.com/Forhall-Labs/nativa-360-backend) | dev, main           |
| `e-com/`   | [nativa-360-e-com](https://github.com/Forhall-Labs/nativa-360-e-com)     | dev, stage, main    |
| `landing/` | [nativa-360-lading](https://github.com/Forhall-Labs/nativa-360-lading)   | dev, stage, main    |

Cada carpeta tiene el historial completo de su repo (importado con
`git subtree`), su propio `package.json`, `README.md`, `CONTRIBUTING.md` y
`AGENTS.md`.

## Flujo

1. Rama nueva desde `dev` en este repo. Un mismo PR puede tocar varios
   proyectos a la vez.
2. PR contra `dev` → `.github/workflows/ci.yml` corre los checks (format,
   spell, lint, test, build; en backend además audit, e2e y Docker) solo de
   las carpetas que el PR toca. El check requerido es **CI ok**.
3. Merge (squash). El push a `dev` dispara
   `.github/workflows/sync.yml`, que hace `git subtree split` de cada carpeta
   y la pushea a la rama `dev` de su repo individual.
4. Ese push dispara, en cada repo individual, su CI y su deploy de siempre
   (Vercel / Render) — los secrets de deploy siguen viviendo allá.
5. Igual para `dev` → `stage` → `main`. `backend` no tiene `stage`: sus
   cambios llegan a `main` del backend cuando se mergea `stage` → `main` acá.

**No commitear directo en los repos individuales.** El sync nunca fuerza: si
un repo individual tiene un commit que el central no tiene, el push se
rechaza y el job falla. Para recuperarlo:

```bash
git subtree pull --prefix=admin https://github.com/Forhall-Labs/nativa-360-admin.git dev
```

## Setup local

```bash
git clone https://github.com/Forhall-Labs/nativa-360-central.git
cd nativa-360-central
git config core.hooksPath .githooks   # pre-commit: lint-staged por proyecto
cd admin && npm install                # en cada proyecto que vayas a tocar
```

## Configuración (una vez)

- Secret `SYNC_TOKEN` en este repo: fine-grained PAT de un admin de
  Forhall-Labs, con acceso a los 4 repos individuales y permisos
  **Contents: Read and write** y **Workflows: Read and write**. Tiene que ser
  de un admin porque las ramas protegidas de los repos individuales piden PR
  y solo los admins las saltan.
- Protección de ramas `dev`, `stage` y `main` en este repo, con **CI ok**
  como check requerido.
