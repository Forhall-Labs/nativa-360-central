# System design — Landing Page

Fuente: SRS de Nativa 360, capítulo IV (diseño). El stack y el estado actual
del scaffold están en [`../AGENTS.md`](../AGENTS.md). Los endpoints están en
[`../../backend/docs/system-design.md`](../../backend/docs/system-design.md).

## Lugar en la solución

```
Visitante (navegador) ──► landing (Next.js en Vercel) ──► API pública (NestJS)
         │
         ├──► e-com (botón "Ver tienda")
         ├──► WhatsApp (enlace wa.me)
         └──► Instagram / Facebook (enlaces)
```

La landing solo **lee** información pública de la API. No tiene sesión ni
formularios que guarden datos. Todo lo que muestra se administra desde
`admin`.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, Vitest + Testing Library
para tests. Detalle en `../AGENTS.md`.

## Página y secciones

Una sola página (`/`) con secciones:

| Sección               | Contenido                                                     | Datos (API)                    | Requisito   |
| --------------------- | ------------------------------------------------------------- | ------------------------------ | ----------- |
| Encabezado            | Logo, menú a las secciones, botón "Ver tienda"                | —                              | MO-05       |
| Presentación          | Quiénes son y qué venden                                      | `GET /negocio`                 | MO-01       |
| Productos destacados  | Tarjetas con nombre, imagen, descripción y precio             | `GET /productos/destacados`    | MO-03       |
| Promociones y eventos | Solo los vigentes (si se confirma que van en la landing)      | `GET /promociones`, `/eventos` | HU-13       |
| Visitas del doctor    | Próximas visitas confirmadas                                  | `GET /visitas-doctor`          | MO-06       |
| Contacto              | Teléfono, dirección, mapa, redes sociales y botón de WhatsApp | `GET /negocio`                 | MO-01…MO-04 |
| Pie de página         | Redes sociales y datos de contacto                            | `GET /negocio`                 | MO-02       |

## Renderizado y datos

- Se renderiza en el servidor con revalidación periódica (ISR), para que
  cargue rápido y se indexe en buscadores, sin pedirle datos a la API en cada
  visita.
- Cada sección que depende de la API funciona por separado: si una falla, se
  oculta esa sección y el resto de la página sigue visible.
- La información mínima de contacto (teléfono y WhatsApp) tiene un valor de
  respaldo para que nunca quede vacía.
- Las imágenes usan `next/image` para servirlas optimizadas.

## Estructura de carpetas

```
src/
  app/
    page.tsx              # arma las secciones
  features/
    negocio/              # presentación, contacto, pie de página
    destacados/
    contenido/            # promociones y eventos
    visitas-doctor/
  shared/
    components/
    lib/                  # cliente de la API, enlace de WhatsApp
```

## Variables de entorno

| Variable               | Para qué                              |
| ---------------------- | ------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL de la API.                        |
| `NEXT_PUBLIC_ECOM_URL` | URL del comercio electrónico (botón). |

`NEXT_PUBLIC_ECOM_URL` todavía no existe en `.env.local.example`: se agrega
cuando se implemente el botón "Ver tienda" (HU-01). Las variables de Supabase
del ejemplo no se usan, porque la landing no tiene sesión.
