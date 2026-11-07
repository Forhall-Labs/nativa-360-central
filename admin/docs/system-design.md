# System design — Administración y gestión

Fuente: SRS de Nativa 360, capítulo IV (diseño). El stack y el estado actual
del scaffold están en [`../AGENTS.md`](../AGENTS.md). El modelo de datos y los
endpoints están en
[`../../backend/docs/system-design.md`](../../backend/docs/system-design.md).

## Lugar en la solución

```
Personal (navegador) ──► admin (Next.js en Vercel) ──► API /admin/* (NestJS)
                               │
                               └──► Supabase Auth (iniciar y cerrar sesión)
```

El admin es la capa de presentación del personal. No tiene lógica de negocio
propia ni acceso directo a la base de datos: todo pasa por la API, que es la
que valida permisos y reglas. El admin oculta lo que el rol no puede hacer
para dar una mejor experiencia, pero no reemplaza la validación del backend.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, TanStack Query para datos
del servidor, React Hook Form + Zod para formularios, `@supabase/supabase-js`
para la sesión, Vitest + Testing Library para tests. Detalle en
`../AGENTS.md`.

## Rutas

Todas requieren sesión, salvo `/login`.

| Ruta                     | Pantalla                                                 | Roles                          | HU           |
| ------------------------ | -------------------------------------------------------- | ------------------------------ | ------------ |
| `/login`                 | Inicio de sesión                                         | Todos                          | HU-15        |
| `/`                      | Inicio: resumen de pedidos pendientes y stock bajo       | Todos                          | —            |
| `/productos`             | Lista, búsqueda y filtro de productos                    | Administrador, empleado        | HU-08        |
| `/productos/nuevo`       | Registrar producto                                       | Administrador                  | HU-08        |
| `/productos/[id]`        | Editar, cambiar imagen o deshabilitar                    | Administrador (precio solo él) | HU-08        |
| `/inventario`            | Existencias y registro de entradas, salidas y ajustes    | Administrador, empleado        | HU-09        |
| `/pedidos`               | Lista de pedidos con filtros por estado, fecha y cliente | Administrador, empleado        | HU-10, HU-12 |
| `/pedidos/[id]`          | Detalle del pedido y cambio de estado                    | Administrador, empleado        | HU-10        |
| `/clientes`              | Lista de clientes                                        | Administrador, empleado        | HU-11        |
| `/clientes/[id]`         | Datos de contacto e historial de pedidos                 | Administrador, empleado        | HU-11, HU-12 |
| `/contenido/negocio`     | Información del negocio que muestra la landing           | Administrador                  | HU-01        |
| `/contenido/promociones` | Promociones                                              | Administrador, autorizado      | HU-13        |
| `/contenido/eventos`     | Eventos                                                  | Administrador, autorizado      | HU-13        |
| `/contenido/multimedia`  | Imágenes y videos                                        | Administrador, autorizado      | HU-13        |
| `/visitas-doctor`        | Visitas del doctor                                       | Administrador, autorizado      | HU-14        |
| `/usuarios`              | Usuarios internos y roles                                | Solo administrador             | HU-15        |

## Estructura de carpetas

Organización por módulo (SRS 2.2.2): cada dominio agrupa sus componentes,
hooks de datos, esquemas y tests.

```
src/
  app/                    # rutas (App Router): solo arman la página
    (auth)/login/
    (panel)/              # layout con menú lateral y guard de sesión
      productos/  inventario/  pedidos/  clientes/
      contenido/  visitas-doctor/  usuarios/
  features/
    productos/            # componentes, useProductos(), esquema Zod, tests
    inventario/
    pedidos/
    clientes/
    contenido/
    visitas-doctor/
    usuarios/
    auth/                 # sesión, rol actual, <RequiereRol>
  shared/
    components/           # botones, tablas, formularios, mensajes
    lib/                  # cliente de la API, cliente de Supabase
```

## Datos y estado

- **Datos del servidor:** TanStack Query. Un hook por operación
  (`useProductos`, `useActualizarEstadoPedido`, …) que llama al cliente de la
  API en `shared/lib`. Después de cada cambio se invalida la consulta
  correspondiente.
- **Formularios:** React Hook Form + Zod. Los esquemas reflejan las reglas
  del backend (campos obligatorios, fechas de fin posteriores al inicio) para
  avisar antes de enviar.
- **Sesión:** Supabase Auth en el navegador. El JWT se manda en cada llamada
  a la API (`Authorization: Bearer`). El rol del usuario lo devuelve la API.

## Permisos en la interfaz

- El layout del panel redirige a `/login` si no hay sesión.
- El menú y los botones se muestran según el rol (por ejemplo, el empleado
  no ve el campo de precio editable ni `/usuarios`).
- Si la API responde 403, se muestra "No tenés permiso para esta acción" y no
  se cambia nada en pantalla.

## Manejo de errores

- 400: se marcan los campos con el mensaje que devuelve la API.
- 401: sesión vencida → redirigir a `/login`.
- 409: mensaje del conflicto (código duplicado, stock insuficiente).
- Error de red o 503: aviso de que no se pudo conectar y botón para
  reintentar; lo que el usuario escribió no se pierde.

## Variables de entorno

| Variable                        | Para qué                       |
| ------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL`           | URL de la API.                 |
| `NEXT_PUBLIC_SUPABASE_URL`      | Proyecto de Supabase (sesión). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase.     |
