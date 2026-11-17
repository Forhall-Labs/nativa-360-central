# Epics — Online store

Epics in Connextra format, organized by functional module (SRS 4.3 and
functional requirements MO-06 to MO-15). Each epic lists its user stories,
which are detailed in [`user-stories.md`](user-stories.md).

Stories HU-01 to HU-15 come from the SRS (section 3.7). Stories from HU-16 on
are **derived from the SRS**: they cover SRS requirements or business rules
that had no story of their own, and must be added to the SRS backlog.

| Epic            | Name                    | Stories             |
| --------------- | ----------------------- | ------------------- |
| [EP-06](#ep-06) | Catalog                 | HU-02, HU-04        |
| [EP-07](#ep-07) | Search and filters      | HU-03               |
| [EP-08](#ep-08) | Promotions in the store | HU-22               |
| [EP-09](#ep-09) | Cart                    | HU-05               |
| [EP-10](#ep-10) | Checkout and orders     | HU-06, HU-23        |
| [EP-11](#ep-11) | WhatsApp coordination   | HU-07               |
| [EP-12](#ep-12) | Customer account        | HU-24, HU-25, HU-26 |

<a id="ep-06"></a>

## EP-06 — Catalog

> **As a** customer, **I want** to browse Nativa 360's products and see their
> details online, **so that** I know what is available and at what price
> without going to the store.

| Story                          | Name                       | Priority | Sprint      | Source |
| ------------------------------ | -------------------------- | -------- | ----------- | ------ |
| [HU-02](user-stories.md#hu-02) | Browse the product catalog | High     | 3 · Catalog | SRS    |
| [HU-04](user-stories.md#hu-04) | View product details       | High     | 3 · Catalog | SRS    |

**Requirements:** MO-06, MO-09 · RN-02 · RNF-02, RNF-05, RNF-06.

<a id="ep-07"></a>

## EP-07 — Search and filters

> **As a** customer, **I want** to search and filter the catalog, **so that**
> I find what I need quickly among all the products.

| Story                          | Name                       | Priority | Sprint      | Source |
| ------------------------------ | -------------------------- | -------- | ----------- | ------ |
| [HU-03](user-stories.md#hu-03) | Search and filter products | High     | 3 · Catalog | SRS    |

**Requirements:** MO-07, MO-08 · RN-02 · RNF-02.

<a id="ep-08"></a>

## EP-08 — Promotions in the store

> **As a** customer, **I want** to see which products are on promotion and
> pay the promotional price, **so that** I can save on my purchase.

| Story                          | Name                          | Priority | Sprint                    | Source                        |
| ------------------------------ | ----------------------------- | -------- | ------------------------- | ----------------------------- |
| [HU-22](user-stories.md#hu-22) | See promotions in the catalog | Medium   | 6 · Customers and content | Derived (RN-19, RN-20, RN-21) |

**Requirements:** RN-19, RN-20, RN-21. The promotions are managed in the
admin panel (HU-13).

<a id="ep-09"></a>

## EP-09 — Cart

> **As a** customer, **I want** to put together the products I want to buy
> and see the estimated total, **so that** I can prepare my order before
> sending it.

| Story                          | Name                     | Priority | Sprint              | Source |
| ------------------------------ | ------------------------ | -------- | ------------------- | ------ |
| [HU-05](user-stories.md#hu-05) | Add products to the cart | High     | 4 · Cart and orders | SRS    |

**Requirements:** MO-10, MO-11, MO-12, MO-13 · RN-02, RN-05.

<a id="ep-10"></a>

## EP-10 — Checkout and orders

> **As a** customer, **I want** to place my order online and choose how to
> receive it, **so that** the store can prepare it without me having to
> explain everything by message.

| Story                          | Name                           | Priority | Sprint              | Source                   |
| ------------------------------ | ------------------------------ | -------- | ------------------- | ------------------------ |
| [HU-06](user-stories.md#hu-06) | Place an order                 | High     | 4 · Cart and orders | SRS                      |
| [HU-23](user-stories.md#hu-23) | Choose pickup or home delivery | Medium   | 4 · Cart and orders | Derived (RN-29 to RN-32) |

**Requirements:** MO-14 · RN-05, RN-09, RN-12, RN-24, RN-29 to RN-32 ·
RNF-01.

**Out of scope:** online payments and automatic stock reservation (RN-12).

<a id="ep-11"></a>

## EP-11 — WhatsApp coordination

> **As a** customer, **I want** to continue my order on WhatsApp with its
> details already written, **so that** I can agree on availability, payment
> and delivery with the staff.

| Story                          | Name                                 | Priority | Sprint              | Source |
| ------------------------------ | ------------------------------------ | -------- | ------------------- | ------ |
| [HU-07](user-stories.md#hu-07) | Coordinate an order through WhatsApp | High     | 4 · Cart and orders | SRS    |

**Requirements:** MO-15 · RN-10, RN-11, RN-13, RN-14 · RNF-10.

**Out of scope:** automatic messages, chatbots and automatic payment
confirmation.

<a id="ep-12"></a>

## EP-12 — Customer account

> **As a** customer, **I want** my own account in the online store, **so that**
> I can place orders and follow them.

| Story                          | Name                          | Priority | Sprint                    | Source           |
| ------------------------------ | ----------------------------- | -------- | ------------------------- | ---------------- |
| [HU-24](user-stories.md#hu-24) | Sign up as a customer         | High     | 4 · Cart and orders       | Derived (RN-24)  |
| [HU-25](user-stories.md#hu-25) | Sign in and out as a customer | High     | 4 · Cart and orders       | Derived (RNF-01) |
| [HU-26](user-stories.md#hu-26) | View my orders                | Medium   | 6 · Customers and content | Derived (RN-26)  |

**Requirements:** RN-24, RN-26 · RNF-01.

**Out of scope:** social login.
