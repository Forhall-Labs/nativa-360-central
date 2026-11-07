# Épica: API de seguridad, usuarios y permisos

> **Como** administrador de Nativa 360, **quiero** que la API verifique quién
> hace cada operación y si tiene permiso, **para** que la información del
> negocio esté protegida aunque alguien intente saltarse el panel.

## Alcance

| HU                        | Nombre                        | Frontend                                                                   |
| ------------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| [HU-15](stories/HU-15.md) | Gestionar usuarios y permisos | [admin](../../../../admin/docs/epics/usuarios-y-permisos/stories/HU-15.md) |

Esta épica también cubre el guard de autenticación y el decorador de roles
que usan todos los endpoints `/admin/*` y los del cliente.

## Módulos

`auth` y `usuarios` (ver [system-design](../../system-design.md)).

## Requisitos relacionados

MO-26 · RN-27, RN-28 · RNF-01 · SRS 4.8.
