# Epics — Administration panel

Epics in Connextra format, organized by functional module (SRS 4.3 and
functional requirements MO-16 to MO-27). Each epic lists its user stories,
which are detailed in [`user-stories.md`](user-stories.md).

Stories HU-01 to HU-15 come from the SRS (section 3.7). Stories from HU-16 on
are **derived from the SRS**: they cover SRS requirements or business rules
that had no story of their own, and must be added to the SRS backlog.

| Epic            | Name                       | Stories             |
| --------------- | -------------------------- | ------------------- |
| [EP-13](#ep-13) | Product catalog management | HU-08, HU-27, HU-28 |
| [EP-14](#ep-14) | Inventory                  | HU-09               |
| [EP-15](#ep-15) | Order management           | HU-10, HU-12        |
| [EP-16](#ep-16) | Payments and cancellations | HU-29, HU-30, HU-31 |
| [EP-17](#ep-17) | Customer management        | HU-11               |
| [EP-18](#ep-18) | Site content               | HU-13, HU-32, HU-33 |
| [EP-19](#ep-19) | Doctor visits              | HU-14               |
| [EP-20](#ep-20) | Users and access           | HU-15, HU-34        |

<a id="ep-13"></a>

## EP-13 — Product catalog management

> **As an** administrator, **I want** to manage products, their categories and
> their images from the panel, **so that** the online catalog always shows
> correct and complete information.

| Story                          | Name                  | Priority | Sprint               | Source          |
| ------------------------------ | --------------------- | -------- | -------------------- | --------------- |
| [HU-08](user-stories.md#hu-08) | Manage products       | High     | 5 · Store management | SRS             |
| [HU-27](user-stories.md#hu-27) | Manage categories     | Medium   | 5 · Store management | Derived (MO-08) |
| [HU-28](user-stories.md#hu-28) | Manage product images | Medium   | 5 · Store management | Derived (MO-19) |

**Requirements:** MO-08, MO-16 to MO-19 · RN-01, RN-02, RN-03, RN-27.

<a id="ep-14"></a>

## EP-14 — Inventory

> **As an** employee, **I want** to keep the stock of each product up to date
> with a record of every movement, **so that** the store knows what it really
> has.

| Story                          | Name             | Priority | Sprint               | Source |
| ------------------------------ | ---------------- | -------- | -------------------- | ------ |
| [HU-09](user-stories.md#hu-09) | Manage inventory | High     | 5 · Store management | SRS    |

**Requirements:** MO-22 · RN-04, RN-06, RN-27 · RNF-04.

<a id="ep-15"></a>

## EP-15 — Order management

> **As** Nativa 360 staff, **I want** to follow every order from the moment it
> is placed until it is delivered, **so that** the whole team knows where
> each order stands.

| Story                          | Name                     | Priority | Sprint                    | Source |
| ------------------------------ | ------------------------ | -------- | ------------------------- | ------ |
| [HU-10](user-stories.md#hu-10) | Update an order's status | High     | 5 · Store management      | SRS    |
| [HU-12](user-stories.md#hu-12) | View order history       | Medium   | 6 · Customers and content | SRS    |

**Requirements:** MO-23, MO-24 · RN-09, RN-10, RN-13.

<a id="ep-16"></a>

## EP-16 — Payments and cancellations

> **As an** administrator, **I want** payments, discounts and cancellations
> to go through clear, recorded steps, **so that** no order is marked as paid,
> discounted or cancelled by mistake.

| Story                          | Name                                | Priority | Sprint               | Source                   |
| ------------------------------ | ----------------------------------- | -------- | -------------------- | ------------------------ |
| [HU-29](user-stories.md#hu-29) | Confirm an order's payment          | High     | 5 · Store management | Derived (RN-14 to RN-17) |
| [HU-30](user-stories.md#hu-30) | Cancel an order and review a refund | Medium   | 5 · Store management | Derived (RN-33)          |
| [HU-31](user-stories.md#hu-31) | Apply a manual discount to an order | Low      | 5 · Store management | Derived (RN-23)          |

**Requirements:** RN-14, RN-15, RN-16, RN-17, RN-23, RN-33 · RNF-01, RNF-04.

**Out of scope:** online payments and automatic payment confirmation.

<a id="ep-17"></a>

## EP-17 — Customer management

> **As an** employee, **I want** to find a customer and see their contact
> data and orders, **so that** I can serve them quickly.

| Story                          | Name                      | Priority | Sprint                    | Source |
| ------------------------------ | ------------------------- | -------- | ------------------------- | ------ |
| [HU-11](user-stories.md#hu-11) | View customer information | Medium   | 6 · Customers and content | SRS    |

**Requirements:** MO-25 · RN-26 · RNF-01.

<a id="ep-18"></a>

## EP-18 — Site content

> **As an** administrator, **I want** to manage everything the public site
> shows (business information, promotions, events, images and videos),
> **so that** the site is always up to date without touching code.

| Story                          | Name                         | Priority | Sprint                    | Source                   |
| ------------------------------ | ---------------------------- | -------- | ------------------------- | ------------------------ |
| [HU-13](user-stories.md#hu-13) | Manage promotions and events | Medium   | 6 · Customers and content | SRS                      |
| [HU-32](user-stories.md#hu-32) | Manage business information  | Medium   | 6 · Customers and content | Derived (MO-20)          |
| [HU-33](user-stories.md#hu-33) | Manage media content         | Low      | 6 · Customers and content | Derived (MO-21, backlog) |

**Requirements:** MO-20, MO-21 · RN-19 to RN-21, RN-37 to RN-42.

<a id="ep-19"></a>

## EP-19 — Doctor visits

> **As an** administrator, **I want** to publish when the doctor will be at the
> store, **so that** customers can plan their visit.

| Story                          | Name                 | Priority | Sprint                    | Source |
| ------------------------------ | -------------------- | -------- | ------------------------- | ------ |
| [HU-14](user-stories.md#hu-14) | Manage doctor visits | Medium   | 6 · Customers and content | SRS    |

**Requirements:** MO-27 · RN-34, RN-35, RN-36.

**Out of scope:** doctor appointment booking.

<a id="ep-20"></a>

## EP-20 — Users and access

> **As an** administrator, **I want** to control who can enter the panel and
> what each person can do, **so that** the business information is
> protected.

| Story                          | Name                         | Priority | Sprint                       | Source            |
| ------------------------------ | ---------------------------- | -------- | ---------------------------- | ----------------- |
| [HU-15](user-stories.md#hu-15) | Manage users and permissions | High     | 7 · Integration and security | SRS               |
| [HU-34](user-stories.md#hu-34) | Sign in and out of the panel | High     | 7 · Integration and security | Derived (SRS 4.8) |

**Requirements:** MO-26 · RN-27, RN-28 · RNF-01 · SRS 4.8.

**Out of scope:** customer accounts (online store, EP-12) and social login.
