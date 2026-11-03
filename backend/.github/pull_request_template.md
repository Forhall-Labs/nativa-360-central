## Resumen

<!-- Qué cambia y por qué. -->

## Rama destino

<!-- dev (integración) · main (producción) — borrar la que no aplique. -->

## Issue relacionado

<!-- "Closes #123" (o "Closes Forhall-Labs/otro-repo#123" si el issue vive en
otro repo) para que GitHub linkee este PR al issue y lo cierre solo al
mergear. Si el PR no cierra el issue todavía, usá "Relacionado con #123". -->

Closes #

## Épica / HU relacionada

<!-- Ej: Epic 1 · HU-1.2 (MN360-00001) — o "N/A" si es infraestructura/tooling. -->

## Checklist

- [ ] Corrí `npm run audit`, `npm run format:check`, `npm run lint`, `npm run spell`, `npm run build` y `npm test` en local sin errores
- [ ] Si el cambio toca `src/prisma/contract.prisma`, corrí `npm run contract:emit` y commiteé los archivos generados
- [ ] Actualicé `AGENTS.md` si el cambio resuelve o agrega algo a la sección TODO
- [ ] No quedaron `console.log`, código comentado ni TODOs sueltos
