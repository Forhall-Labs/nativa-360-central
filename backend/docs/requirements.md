# Requirements — API (backend)

Source: Nativa 360 SRS, sections 3.8.3.3 and 3.8.3.4 (interfaces), 3.8.4
(functional requirements), 3.8.5 (data and business rules) and 3.8.7
(non-functional requirements).

## Purpose

The API is the only door to Nativa 360's data. The three frontends
(`landing`, `e-com`, `admin`) use it to read and update products, inventory,
orders, customers, users and content. It is also where **business rules and
permissions are enforced**: frontends may validate for a better experience,
but the final decision always belongs to the backend.

## Consumers

| Consumer  | Access                             | Uses the API for                                                       |
| --------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `landing` | Public                             | Business information, featured products, doctor visits, content.       |
| `e-com`   | Public and authenticated customers | Catalog, search, details, placing orders and viewing their own orders. |
| `admin`   | Authenticated staff (by role)      | Managing products, inventory, orders, customers, content and users.    |

## Functional requirements by resource

| Resource                 | Operations                                                          | SRS requirements             | HU                           |
| ------------------------ | ------------------------------------------------------------------- | ---------------------------- | ---------------------------- |
| Business information     | Read (public); update (admin)                                       | MO-01, MO-02, MO-20          | HU-01, HU-32                 |
| Products                 | List, search, filter, details (public); create, edit, disable       | MO-03, MO-06…MO-09, MO-16…19 | HU-02…04, 08, 16, 22, 28     |
| Categories               | List (public); manage (admin)                                       | MO-08                        | HU-03, HU-27                 |
| Inventory                | Read and adjust stock with reason and user                          | MO-22                        | HU-09                        |
| Orders                   | Place (customer); list own (customer); list, view and change status | MO-14, MO-23, MO-24          | HU-06, 10, 12, 23, 26, 29–31 |
| Customers                | Account sign-up (customer); view customers and history (admin)      | MO-25                        | HU-11, HU-24, HU-25          |
| Promotions and events    | List active (public); create, edit, disable (admin)                 | MO-21                        | HU-13, HU-21                 |
| Media content            | List published (public); publish and unpublish (admin)              | MO-21                        | HU-33                        |
| Doctor visits            | List confirmed (public); create, edit, publish, disable (admin)     | MO-06 (landing), MO-27       | HU-14, HU-20                 |
| Internal users and roles | Create, edit, enable, disable, assign role (administrator only)     | MO-26                        | HU-15, HU-34                 |

The cart (HU-05) lives in the customer's browser: the API only receives the
final order and validates products, prices and quantities.

## Business rules enforced by the API

| Code         | Rule                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| RN-01        | Unique product code.                                                                             |
| RN-02        | Public endpoints only return active products.                                                    |
| RN-03        | Name, description, price and image are required for a product.                                   |
| RN-05        | Rejects orders for more units than are in stock.                                                 |
| RN-06        | Every inventory adjustment stores the reason and the responsible user.                           |
| RN-09        | The order stores products, quantities and the estimated total (calculated on the server).        |
| RN-12        | Placing an order does not deduct or reserve stock.                                               |
| RN-15…RN-17  | Only an administrator or authorized employee confirms payments; the amount must match.           |
| RN-19…RN-21  | Promotions only while active, only on their products or categories, never stacked.               |
| RN-23, RN-27 | Employees cannot change prices or authorize discounts; only the administrator can.               |
| RN-24, RN-26 | Orders require a customer account; each customer only sees their own orders.                     |
| RN-28        | Only the administrator assigns or changes roles.                                                 |
| RN-34…RN-38  | End dates and times after the start; only confirmed items are published; events need a location. |
| RN-40…RN-42  | Public content respects its publication period and disappears when unpublished.                  |

## Non-functional requirements

| Code   | Type            | How it applies to the API                                                                                                  |
| ------ | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| RNF-01 | Security        | Authentication with Supabase Auth (JWT); role-based authorization on every endpoint; all input validated; restricted CORS. |
| RNF-02 | Performance     | Paginated lists; indexes for search and filters; cache for public reads.                                                   |
| RNF-03 | Availability    | `/health` endpoint for monitoring; consistent error format the frontends can display.                                      |
| RNF-04 | Recovery        | Database backups before production; confirmed operations are not lost on temporary failures.                               |
| RNF-07 | Scalability     | One NestJS module per resource; new features without restructuring existing ones.                                          |
| RNF-08 | Maintainability | Contract documented in Swagger (`/docs`); unit and e2e tests.                                                              |

## Out of scope

- Online payment processing.
- Sending WhatsApp messages or integrating with its API.
- Automatic stock reservation (RN-12).

## Open questions

- Whether an order deducts stock when it becomes **confirmed** or when it
  becomes **delivered** (RN-12 only says stock is not reserved while
  pending).
- Home delivery (RN-29 to RN-32): if it is part of the first version, orders
  need a delivery type, address and shipping cost.
