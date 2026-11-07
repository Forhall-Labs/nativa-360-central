# Documentación de Nativa 360

Punto de entrada a la documentación funcional y de diseño del proyecto. Si sos
una persona o una IA que va a trabajar en el repo, empezá acá: este archivo te
dice **qué proyecto resuelve cada cosa** y **qué documento leer** antes de
tocar código.

La fuente de verdad de los requisitos es el documento formal (SRS) del
proyecto. Los archivos de `docs/` lo bajan a cada proyecto en un formato que
se puede versionar y que la IA puede leer por partes.

## El negocio en una línea

Nativa 360 es una macrobiótica de Pérez Zeledón que vende suplementos,
vitaminas, productos naturales y artículos de cuidado personal. La solución
web le da presencia en línea, un catálogo con pedidos para recoger en tienda
(pago y coordinación manual por WhatsApp) y un panel interno para gestionar
productos, inventario, pedidos y contenido.

## Proyectos

| Proyecto   | Qué es                                      | Usuarios                            | Documentación                       |
| ---------- | ------------------------------------------- | ----------------------------------- | ----------------------------------- |
| `landing/` | Página de presentación del negocio          | Clientes y visitantes               | [`landing/docs/`](../landing/docs/) |
| `e-com/`   | Tienda en línea: catálogo, carrito, pedidos | Clientes                            | [`e-com/docs/`](../e-com/docs/)     |
| `admin/`   | Panel de administración y gestión           | Empleados, administrador, dueño     | [`admin/docs/`](../admin/docs/)     |
| `backend/` | API que usan los tres frontends             | Los frontends (no usuarios finales) | [`backend/docs/`](../backend/docs/) |

## Qué leer según la tarea

| Si la tarea es…                                  | Leé primero                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Implementar una historia de usuario (HU)         | `<proyecto>/docs/epics/<épica>/stories/<HU>.md` y la `epic.md` de su carpeta                             |
| Entender qué debe hacer un proyecto              | `<proyecto>/docs/requirements.md`                                                                        |
| Agregar un módulo, endpoint, tabla o integración | `<proyecto>/docs/system-design.md` y [`backend/docs/system-design.md`](../backend/docs/system-design.md) |
| Construir o cambiar una pantalla                 | `<proyecto>/docs/ui-spec.md` (solo `landing`, `e-com` y `admin`)                                         |
| Configurar el entorno, el flujo de Git o el CI   | [`README.md`](../README.md) y [`AGENTS.md`](../AGENTS.md) de la raíz                                     |
| Entender la nota del PR                          | [`PR_SCORE.md`](PR_SCORE.md)                                                                             |

Una HU de frontend casi siempre tiene su contraparte en el backend: revisá
las dos carpetas antes de empezar.

## Mapa de historias de usuario

| HU    | Nombre                                | Proyecto(s)               | Sprint                      |
| ----- | ------------------------------------- | ------------------------- | --------------------------- |
| HU-01 | Consultar información del negocio     | landing · admin · backend | 2 · Landing page            |
| HU-02 | Consultar catálogo de productos       | e-com · backend           | 3 · Catálogo                |
| HU-03 | Buscar y filtrar productos            | e-com · backend           | 3 · Catálogo                |
| HU-04 | Consultar el detalle de un producto   | e-com · backend           | 3 · Catálogo                |
| HU-05 | Agregar productos al carrito          | e-com · backend           | 4 · Carrito y pedidos       |
| HU-06 | Registrar un pedido                   | e-com · backend           | 4 · Carrito y pedidos       |
| HU-07 | Coordinar un pedido mediante WhatsApp | e-com                     | 4 · Carrito y pedidos       |
| HU-08 | Administrar productos                 | admin · backend           | 5 · Gestión administrativa  |
| HU-09 | Gestionar el inventario               | admin · backend           | 5 · Gestión administrativa  |
| HU-10 | Actualizar el estado de un pedido     | admin · backend           | 5 · Gestión administrativa  |
| HU-11 | Consultar información de clientes     | admin · backend           | 6 · Clientes y contenido    |
| HU-12 | Consultar el historial de pedidos     | admin · backend           | 6 · Clientes y contenido    |
| HU-13 | Administrar promociones y eventos     | admin · backend           | 6 · Clientes y contenido    |
| HU-14 | Administrar visitas del doctor        | admin · landing · backend | 6 · Clientes y contenido    |
| HU-15 | Gestionar usuarios y permisos         | admin · backend           | 7 · Integración y seguridad |

## Estructura de cada `docs/` de proyecto

```
<proyecto>/docs/
  requirements.md          # requisitos funcionales y no funcionales
  ui-spec.md               # lineamientos de UI (solo proyectos front)
  system-design.md         # arquitectura, módulos, integraciones, datos
  epics/
    <épica>/
      epic.md              # épica en formato Connextra
      stories/<HU>.md      # HU con escenarios Gherkin
```

## Convenciones

- **Épicas** en formato Connextra: _Como <rol>, quiero <capacidad>, para
  <beneficio>._
- **Historias de usuario** con su enunciado Connextra y escenarios Gherkin en
  español: al menos uno **positivo**, uno **negativo**, uno **de error** y
  uno **de validación**.
- Los identificadores (`HU-01` … `HU-15`) son los del SRS. Si una HU cambia,
  se actualiza el archivo de la HU y esta tabla en el mismo PR.
