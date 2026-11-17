# Nativa 360 documentation

Entry point to the functional and design documentation. If you are a person
or an AI about to work on this repo, start here: this file tells you **which
project owns each feature** and **which document to read** before touching
code.

The source of truth for requirements is the project's formal SRS document.
The files under `docs/` break it down per project in a format that can be
versioned and read by an AI in parts.

## The business in one line

Nativa 360 is a macrobiotic store in Pérez Zeledón that sells supplements,
vitamins, natural products and personal care items. The web solution gives
it an online presence, a catalog with orders for in-store pickup (payment
and coordination are handled manually over WhatsApp) and an internal panel
to manage products, inventory, orders and content.

## Projects

| Project    | What it is                          | Users                           | Documentation                       |
| ---------- | ----------------------------------- | ------------------------------- | ----------------------------------- |
| `landing/` | Business presentation page          | Customers and visitors          | [`landing/docs/`](../landing/docs/) |
| `e-com/`   | Online store: catalog, cart, orders | Customers                       | [`e-com/docs/`](../e-com/docs/)     |
| `admin/`   | Administration and management panel | Employees, administrator, owner | [`admin/docs/`](../admin/docs/)     |
| `backend/` | API used by the three frontends     | The frontends (not end users)   | [`backend/docs/`](../backend/docs/) |

## What to read for each task

| If the task is…                                 | Read first                                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Implementing a user story (HU)                  | `<project>/docs/user-stories.md` (the story) and `<project>/docs/epics.md` (its epic)                     |
| Understanding what a project must do            | `<project>/docs/requirements.md`                                                                          |
| Adding a module, endpoint, table or integration | `<project>/docs/system-design.md` and [`backend/docs/system-design.md`](../backend/docs/system-design.md) |
| Building or changing a screen                   | `<project>/docs/ui-spec.md` (only `landing`, `e-com` and `admin`)                                         |
| Setting up the environment, Git flow or CI      | [`README.md`](../README.md) and [`AGENTS.md`](../AGENTS.md) at the repo root                              |
| Understanding the PR score                      | [`PR_SCORE.md`](PR_SCORE.md)                                                                              |

A frontend story almost always has a backend counterpart: check
`backend/docs/user-stories.md` for the same HU before starting.

## User story map

HU-01 to HU-15 come from the SRS (section 3.7). HU-16 on are **derived from
the SRS**: they cover SRS requirements or business rules that had no story
of their own, and must be added to the SRS backlog.

| HU    | Name                                 | Epic (frontend)                  | Project(s)        | Sprint                       |
| ----- | ------------------------------------ | -------------------------------- | ----------------- | ---------------------------- |
| HU-01 | View business information            | EP-01 Business presentation      | landing · backend | 2 · Landing page             |
| HU-16 | View featured products               | EP-02 Featured products          | landing · backend | 2 · Landing page             |
| HU-17 | Contact the store on WhatsApp        | EP-03 Contact and social media   | landing           | 2 · Landing page             |
| HU-18 | Visit the store's social media       | EP-03 Contact and social media   | landing           | 2 · Landing page             |
| HU-19 | Go to the online store               | EP-04 Navigation to the store    | landing           | 2 · Landing page             |
| HU-20 | View upcoming doctor visits          | EP-05 Doctor visits and news     | landing · backend | 6 · Customers and content    |
| HU-21 | View active promotions and events    | EP-05 Doctor visits and news     | landing · backend | 6 · Customers and content    |
| HU-02 | Browse the product catalog           | EP-06 Catalog                    | e-com · backend   | 3 · Catalog                  |
| HU-04 | View product details                 | EP-06 Catalog                    | e-com · backend   | 3 · Catalog                  |
| HU-03 | Search and filter products           | EP-07 Search and filters         | e-com · backend   | 3 · Catalog                  |
| HU-22 | See promotions in the catalog        | EP-08 Promotions in the store    | e-com · backend   | 6 · Customers and content    |
| HU-05 | Add products to the cart             | EP-09 Cart                       | e-com             | 4 · Cart and orders          |
| HU-06 | Place an order                       | EP-10 Checkout and orders        | e-com · backend   | 4 · Cart and orders          |
| HU-23 | Choose pickup or home delivery       | EP-10 Checkout and orders        | e-com · backend   | 4 · Cart and orders          |
| HU-07 | Coordinate an order through WhatsApp | EP-11 WhatsApp coordination      | e-com             | 4 · Cart and orders          |
| HU-24 | Sign up as a customer                | EP-12 Customer account           | e-com · backend   | 4 · Cart and orders          |
| HU-25 | Sign in and out as a customer        | EP-12 Customer account           | e-com · backend   | 4 · Cart and orders          |
| HU-26 | View my orders                       | EP-12 Customer account           | e-com · backend   | 6 · Customers and content    |
| HU-08 | Manage products                      | EP-13 Product catalog management | admin · backend   | 5 · Store management         |
| HU-27 | Manage categories                    | EP-13 Product catalog management | admin · backend   | 5 · Store management         |
| HU-28 | Manage product images                | EP-13 Product catalog management | admin · backend   | 5 · Store management         |
| HU-09 | Manage inventory                     | EP-14 Inventory                  | admin · backend   | 5 · Store management         |
| HU-10 | Update an order's status             | EP-15 Order management           | admin · backend   | 5 · Store management         |
| HU-12 | View order history                   | EP-15 Order management           | admin · backend   | 6 · Customers and content    |
| HU-29 | Confirm an order's payment           | EP-16 Payments and cancellations | admin · backend   | 5 · Store management         |
| HU-30 | Cancel an order and review a refund  | EP-16 Payments and cancellations | admin · backend   | 5 · Store management         |
| HU-31 | Apply a manual discount to an order  | EP-16 Payments and cancellations | admin · backend   | 5 · Store management         |
| HU-11 | View customer information            | EP-17 Customer management        | admin · backend   | 6 · Customers and content    |
| HU-13 | Manage promotions and events         | EP-18 Site content               | admin · backend   | 6 · Customers and content    |
| HU-32 | Manage business information          | EP-18 Site content               | admin · backend   | 6 · Customers and content    |
| HU-33 | Manage media content                 | EP-18 Site content               | admin · backend   | 6 · Customers and content    |
| HU-14 | Manage doctor visits                 | EP-19 Doctor visits              | admin · backend   | 6 · Customers and content    |
| HU-15 | Manage users and permissions         | EP-20 Users and access           | admin · backend   | 7 · Integration and security |
| HU-34 | Sign in and out of the panel         | EP-20 Users and access           | admin · backend   | 7 · Integration and security |

Epics EP-01 to EP-20 are the frontend epics (landing EP-01 to EP-05, e-com
EP-06 to EP-12, admin EP-13 to EP-20); EP-21 to EP-28 are the API epics, one
per backend module. Each project's `epics.md` lists its epics and stories,
and each story in `user-stories.md` links back to its epic.

## Per-project `docs/` structure

```
<project>/docs/
  requirements.md     # functional and non-functional requirements
  system-design.md    # architecture, modules, integrations, data
  ui-spec.md          # UI guidelines (frontend projects only)
  epics.md            # all the project's epics, in Connextra format
  user-stories.md     # all the project's user stories, with Gherkin scenarios
```

## Conventions

- **Epics** use the Connextra format: _As a <role>, I want <capability>, so
  that <benefit>._
- **User stories** have their Connextra statement and Gherkin scenarios with
  at least one **positive**, one **negative**, one **error** and one
  **validation** scenario.
- Identifiers come from the SRS and are kept in their original form:
  `HU-xx` (user story), `MO-xx` (functional requirement), `RN-xx` (business
  rule) and `RNF-xx` (non-functional requirement).
- If a story changes, update `user-stories.md` (and this table, if needed) in
  the same PR.
