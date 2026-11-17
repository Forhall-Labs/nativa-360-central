# Epics — API (backend)

Epics in Connextra format, one per API module (see
[`system-design.md`](system-design.md)). Each epic groups the API side of the
frontend stories, which keep the same HU code; the API stories are detailed
in [`user-stories.md`](user-stories.md).

Stories HU-01 to HU-15 come from the SRS (section 3.7). Stories from HU-16 on
are **derived from the SRS** and must be added to the SRS backlog.

| Epic            | Name                                 | Module             | Stories                                                |
| --------------- | ------------------------------------ | ------------------ | ------------------------------------------------------ |
| [EP-21](#ep-21) | Business information API             | `negocio`          | HU-01, HU-32                                           |
| [EP-22](#ep-22) | Catalog API                          | `productos`        | HU-02, HU-03, HU-04, HU-08, HU-16, HU-22, HU-27, HU-28 |
| [EP-23](#ep-23) | Inventory API                        | `inventario`       | HU-09                                                  |
| [EP-24](#ep-24) | Orders API                           | `pedidos`          | HU-06, HU-10, HU-12, HU-23, HU-26, HU-29, HU-30, HU-31 |
| [EP-25](#ep-25) | Customers API                        | `clientes`         | HU-11, HU-24                                           |
| [EP-26](#ep-26) | Content API                          | `contenido`        | HU-13, HU-21, HU-33                                    |
| [EP-27](#ep-27) | Doctor visits API                    | `visitas`          | HU-14, HU-20                                           |
| [EP-28](#ep-28) | Authentication and authorization API | `auth`, `usuarios` | HU-15, HU-25, HU-34                                    |

Stories without an API side: HU-05 (the cart lives in the browser), HU-07,
HU-17, HU-18 and HU-19 (links built by the frontend with data from HU-01).

<a id="ep-21"></a>

## EP-21 — Business information API

> **As a** Nativa 360 frontend, **I want** an API that serves and updates the
> business information, **so that** the contact data is the same everywhere
> and is never hard-coded.

| Story                          | Name                        | Frontend                                            |
| ------------------------------ | --------------------------- | --------------------------------------------------- |
| [HU-01](user-stories.md#hu-01) | View business information   | [landing](../../landing/docs/user-stories.md#hu-01) |
| [HU-32](user-stories.md#hu-32) | Manage business information | [admin](../../admin/docs/user-stories.md#hu-32)     |

**Requirements:** MO-01, MO-02, MO-04, MO-20.

<a id="ep-22"></a>

## EP-22 — Catalog API

> **As a** Nativa 360 frontend, **I want** an API that serves and manages
> products, categories, images and promotional prices, **so that** the
> catalog is consistent in the landing page, the online store and the panel.

| Story                          | Name                          | Frontend                                            |
| ------------------------------ | ----------------------------- | --------------------------------------------------- |
| [HU-02](user-stories.md#hu-02) | Browse the product catalog    | [e-com](../../e-com/docs/user-stories.md#hu-02)     |
| [HU-03](user-stories.md#hu-03) | Search and filter products    | [e-com](../../e-com/docs/user-stories.md#hu-03)     |
| [HU-04](user-stories.md#hu-04) | View product details          | [e-com](../../e-com/docs/user-stories.md#hu-04)     |
| [HU-16](user-stories.md#hu-16) | View featured products        | [landing](../../landing/docs/user-stories.md#hu-16) |
| [HU-22](user-stories.md#hu-22) | See promotions in the catalog | [e-com](../../e-com/docs/user-stories.md#hu-22)     |
| [HU-08](user-stories.md#hu-08) | Manage products               | [admin](../../admin/docs/user-stories.md#hu-08)     |
| [HU-27](user-stories.md#hu-27) | Manage categories             | [admin](../../admin/docs/user-stories.md#hu-27)     |
| [HU-28](user-stories.md#hu-28) | Manage product images         | [admin](../../admin/docs/user-stories.md#hu-28)     |

**Requirements:** MO-03, MO-06 to MO-09, MO-16 to MO-19 · RN-01 to RN-03,
RN-19 to RN-21, RN-27 · RNF-02.

<a id="ep-23"></a>

## EP-23 — Inventory API

> **As the** administration panel, **I want** an API that records every stock
> movement with its reason and user, **so that** stock only changes in a
> traceable way.

| Story                          | Name             | Frontend                                        |
| ------------------------------ | ---------------- | ----------------------------------------------- |
| [HU-09](user-stories.md#hu-09) | Manage inventory | [admin](../../admin/docs/user-stories.md#hu-09) |

**Requirements:** MO-22 · RN-04, RN-06, RN-27 · RNF-04.

<a id="ep-24"></a>

## EP-24 — Orders API

> **As a** Nativa 360 frontend, **I want** an API that places orders and
> controls their statuses, payments, discounts and cancellations, **so that**
> the store has a reliable record of what it sells.

| Story                          | Name                                | Frontend                                        |
| ------------------------------ | ----------------------------------- | ----------------------------------------------- |
| [HU-06](user-stories.md#hu-06) | Place an order                      | [e-com](../../e-com/docs/user-stories.md#hu-06) |
| [HU-23](user-stories.md#hu-23) | Choose pickup or home delivery      | [e-com](../../e-com/docs/user-stories.md#hu-23) |
| [HU-26](user-stories.md#hu-26) | View my orders                      | [e-com](../../e-com/docs/user-stories.md#hu-26) |
| [HU-10](user-stories.md#hu-10) | Update an order's status            | [admin](../../admin/docs/user-stories.md#hu-10) |
| [HU-12](user-stories.md#hu-12) | View order history                  | [admin](../../admin/docs/user-stories.md#hu-12) |
| [HU-29](user-stories.md#hu-29) | Confirm an order's payment          | [admin](../../admin/docs/user-stories.md#hu-29) |
| [HU-30](user-stories.md#hu-30) | Cancel an order and review a refund | [admin](../../admin/docs/user-stories.md#hu-30) |
| [HU-31](user-stories.md#hu-31) | Apply a manual discount to an order | [admin](../../admin/docs/user-stories.md#hu-31) |

**Requirements:** MO-14, MO-23, MO-24 · RN-05, RN-09 to RN-17, RN-23,
RN-24, RN-26, RN-29 to RN-33 · RNF-01, RNF-04.

<a id="ep-25"></a>

## EP-25 — Customers API

> **As a** Nativa 360 frontend, **I want** an API that registers customers and
> lets the staff look them up, **so that** every order is tied to a known
> customer.

| Story                          | Name                      | Frontend                                        |
| ------------------------------ | ------------------------- | ----------------------------------------------- |
| [HU-24](user-stories.md#hu-24) | Sign up as a customer     | [e-com](../../e-com/docs/user-stories.md#hu-24) |
| [HU-11](user-stories.md#hu-11) | View customer information | [admin](../../admin/docs/user-stories.md#hu-11) |

**Requirements:** MO-25 · RN-24, RN-26 · RNF-01.

<a id="ep-26"></a>

## EP-26 — Content API

> **As a** Nativa 360 frontend, **I want** an API that publishes promotions,
> events and media respecting their dates, **so that** the site only shows
> what is currently valid.

| Story                          | Name                              | Frontend                                            |
| ------------------------------ | --------------------------------- | --------------------------------------------------- |
| [HU-21](user-stories.md#hu-21) | View active promotions and events | [landing](../../landing/docs/user-stories.md#hu-21) |
| [HU-13](user-stories.md#hu-13) | Manage promotions and events      | [admin](../../admin/docs/user-stories.md#hu-13)     |
| [HU-33](user-stories.md#hu-33) | Manage media content              | [admin](../../admin/docs/user-stories.md#hu-33)     |

**Requirements:** MO-21 · RN-19 to RN-21, RN-37 to RN-42.

<a id="ep-27"></a>

## EP-27 — Doctor visits API

> **As a** Nativa 360 frontend, **I want** an API that manages doctor visits
> and only publishes confirmed ones, **so that** customers never see a visit
> that will not happen.

| Story                          | Name                        | Frontend                                            |
| ------------------------------ | --------------------------- | --------------------------------------------------- |
| [HU-20](user-stories.md#hu-20) | View upcoming doctor visits | [landing](../../landing/docs/user-stories.md#hu-20) |
| [HU-14](user-stories.md#hu-14) | Manage doctor visits        | [admin](../../admin/docs/user-stories.md#hu-14)     |

**Requirements:** MO-06 (landing), MO-27 · RN-34, RN-35, RN-36.

<a id="ep-28"></a>

## EP-28 — Authentication and authorization API

> **As** Nativa 360's administrator, **I want** the API to check who performs
> each operation and whether they are allowed to, **so that** the business
> information is protected even if someone tries to bypass the frontends.

| Story                          | Name                          | Frontend                                        |
| ------------------------------ | ----------------------------- | ----------------------------------------------- |
| [HU-25](user-stories.md#hu-25) | Sign in and out as a customer | [e-com](../../e-com/docs/user-stories.md#hu-25) |
| [HU-34](user-stories.md#hu-34) | Sign in and out of the panel  | [admin](../../admin/docs/user-stories.md#hu-34) |
| [HU-15](user-stories.md#hu-15) | Manage users and permissions  | [admin](../../admin/docs/user-stories.md#hu-15) |

This epic also covers the authentication guard and the roles decorator used
by every `/admin/*` endpoint and by the customer endpoints.

**Requirements:** MO-26 · RN-27, RN-28 · RNF-01 · SRS 4.8.
