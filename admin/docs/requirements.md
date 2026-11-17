# Requirements — Administration panel

Source: Nativa 360 SRS, sections 3.8.2.2 (roles), 3.8.4.3 (functional
requirements), 3.8.5 (business rules) and 3.8.7 (non-functional
requirements).

## Purpose

The administration panel lets authorized staff manage products, inventory,
orders, customers and the content published on the site (business
information, promotions, events, media and doctor visits). Each feature is
available according to the user's role.

## Users and roles

| Role          | What they can do                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| Administrator | Everything: products, prices, inventory, orders, customers, content, doctor visits, users and roles. |
| Employee      | View products, update stock and move orders through their statuses. Cannot change prices.            |
| Owner         | View information and validate the system. Administrative features only if granted.                   |

## Functional requirements

| Code  | Requirement                  | Description                                                                         | HU           |
| ----- | ---------------------------- | ----------------------------------------------------------------------------------- | ------------ |
| MO-16 | Add products                 | Registers products with name, description, price, image, category and availability. | HU-08        |
| MO-17 | Edit products                | Updates existing products.                                                          | HU-08        |
| MO-18 | Disable products             | Disables products that are no longer sold, without deleting their history.          | HU-08        |
| MO-19 | Manage product images        | Adds, changes or updates a product's images.                                        | HU-28        |
| MO-20 | Manage business information  | Updates the business information shown on the landing page.                         | HU-32        |
| MO-21 | Manage informative content   | Adds, edits and disables promotions, events and published information.              | HU-13, HU-33 |
| MO-22 | Manage inventory             | Views and updates product stock.                                                    | HU-09        |
| MO-23 | Manage orders                | Views placed orders and their information.                                          | HU-10, HU-12 |
| MO-24 | Update order statuses        | Changes an order's status as it is handled.                                         | HU-10        |
| MO-25 | View customer information    | Views customers and their order history.                                            | HU-11, HU-12 |
| MO-26 | Manage users and permissions | Manages internal accounts and assigns permissions by role.                          | HU-15        |
| MO-27 | Manage doctor visits         | Registers, views, edits, publishes and disables doctor visits.                      | HU-14        |

Derived stories cover the rest of the panel rules: HU-27 (categories,
MO-08), HU-29 (payment confirmation, RN-14 to RN-17), HU-30 (cancellations
and refunds, RN-33), HU-31 (manual discounts, RN-23) and HU-34 (sign in and
out, SRS 4.8).

Order statuses (HU-10): **pending**, **in review**, **confirmed**,
**prepared**, **delivered** and **cancelled**.

## Business rules

| Code  | Rule                                                                                              |
| ----- | ------------------------------------------------------------------------------------------------- |
| RN-01 | Each product has a unique code.                                                                   |
| RN-03 | Every product has at least a name, description, price and image.                                  |
| RN-04 | Each product's available quantity can be updated.                                                 |
| RN-06 | Every inventory adjustment records the reason and the responsible user.                           |
| RN-10 | Final availability of an order's products is checked manually by the staff.                       |
| RN-13 | If a product is not available, the staff tells the customer while coordinating the order.         |
| RN-14 | A receipt sent over WhatsApp is not enough: an authorized person verifies the money was received. |
| RN-15 | Only the administrator or an authorized employee confirms an order's payment.                     |
| RN-16 | An order is only shipped once it is fully paid.                                                   |
| RN-17 | The amount received must match the order total for it to count as paid.                           |
| RN-21 | Two promotions cannot stack on the same product.                                                  |
| RN-23 | Only the administrator authorizes manual discounts on an order.                                   |
| RN-27 | Employees update stock but cannot change prices or authorize discounts.                           |
| RN-28 | Only the administrator assigns or changes roles.                                                  |
| RN-33 | Cancelling a paid order requires reviewing the refund.                                            |
| RN-34 | A doctor visit's end time is after its start time.                                                |
| RN-35 | Only visits with a confirmed date and time are published.                                         |
| RN-36 | A cancelled visit is no longer announced.                                                         |
| RN-37 | An event's end date and time are after its start.                                                 |
| RN-38 | Every in-person event has a location before it is published.                                      |
| RN-39 | Only authorized staff publish or unpublish media content.                                         |
| RN-41 | A publication's end date, if any, is after its start date.                                        |

## Non-functional requirements

| Code   | Type            | How it applies to the admin panel                                                 |
| ------ | --------------- | --------------------------------------------------------------------------------- |
| RNF-01 | Security        | Login required; every screen and action is restricted by role.                    |
| RNF-04 | Recovery        | Important actions (prices, inventory, statuses) are recorded with user and date.  |
| RNF-05 | Usability       | Built for non-technical staff; required fields marked; clear error messages.      |
| RNF-06 | Accessibility   | Usable on desktop and tablet; responsive on phones for quick checks.              |
| RNF-08 | Maintainability | Modules split by domain (products, inventory, orders, customers, content, users). |

## Out of scope

- Automatic messages to customers or automatic payment confirmation.
- Doctor appointment booking (HU-14 only publishes the visit).
- Permanently deleting products or orders: they are disabled to keep the
  history.

## Open questions

- Whether employees can create new products or only update them.
- Which order statuses employees can change and which only the
  administrator can (for example, confirming payment or cancelling).
- Whether inventory entries, exits and adjustments from HU-09 are part of
  the first version ("according to the defined scope").
