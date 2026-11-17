# Requirements — Online store

Source: Nativa 360 SRS, sections 3.8.4.2 (functional requirements), 3.8.5
(business rules) and 3.8.7 (non-functional requirements).

## Purpose

The online store lets customers browse the catalog, search and filter
products, build a cart and place an order. Payment and final coordination
happen **manually over WhatsApp** with Nativa 360's staff: there are no
online payments.

## Users

| Role     | What they do in the online store                                      |
| -------- | --------------------------------------------------------------------- |
| Visitor  | Browses the catalog, searches, filters and views product details.     |
| Customer | With a registered account: builds a cart, places orders, sees theirs. |

## Functional requirements

| Code  | Requirement                       | Description                                                                    | HU    |
| ----- | --------------------------------- | ------------------------------------------------------------------------------ | ----- |
| MO-06 | Show available products           | Shows products with name, image, description, price and availability.          | HU-02 |
| MO-07 | Search products                   | Search by words in the name, description or features.                          | HU-03 |
| MO-08 | Filter products                   | Filter by category or other defined criteria.                                  | HU-03 |
| MO-09 | View product details              | Shows name, description, image, price, category and availability.              | HU-04 |
| MO-10 | Add products to the cart          | Adds available products to the cart.                                           | HU-05 |
| MO-11 | Change quantities in the cart     | Increases or decreases the units of a product in the cart.                     | HU-05 |
| MO-12 | Remove products from the cart     | Removes products from the cart.                                                | HU-05 |
| MO-13 | Calculate the estimated total     | Calculates and shows the estimated total from prices and quantities.           | HU-05 |
| MO-14 | Place an order                    | Registers the order with products, quantities, customer data and total.        | HU-06 |
| MO-15 | Coordinate the order via WhatsApp | Gives access to the store's WhatsApp to coordinate order and payment manually. | HU-07 |

Derived stories cover the promotion, delivery and account rules: HU-22
(promotions, RN-19 to RN-21), HU-23 (pickup or home delivery, RN-29 to
RN-32), HU-24 and HU-25 (customer account, RN-24, RNF-01) and HU-26 (my
orders, RN-26).

## Business rules

| Code  | Rule                                                                            |
| ----- | ------------------------------------------------------------------------------- |
| RN-02 | Only active products are shown in the catalog.                                  |
| RN-05 | An order cannot be placed for more units than are in stock.                     |
| RN-09 | Placing an order stores the products, their quantities and the estimated total. |
| RN-10 | Final availability is checked manually by the staff.                            |
| RN-11 | Order and payment confirmation happen manually over WhatsApp.                   |
| RN-12 | The system does not reserve stock while an order is pending confirmation.       |
| RN-19 | A promotion only applies during its validity period.                            |
| RN-20 | Promotions only apply to the products or categories defined for them.           |
| RN-21 | Two promotions cannot stack on the same product.                                |
| RN-24 | Customers need a registered account to place orders.                            |
| RN-26 | Each customer can only see their own orders.                                    |
| RN-30 | A home delivery order requires a complete delivery address and contact.         |
| RN-31 | The shipping cost is agreed before the customer confirms the order.             |
| RN-32 | In-store pickup orders have no shipping cost.                                   |

## Non-functional requirements

| Code   | Type          | How it applies to the online store                                                   |
| ------ | ------------- | ------------------------------------------------------------------------------------ |
| RNF-01 | Security      | Customer credentials are protected; each customer only accesses their own data.      |
| RNF-02 | Performance   | Catalog, search and filters respond in a reasonable time; optimized images.          |
| RNF-03 | Availability  | If the API is down, a clear message is shown instead of a broken screen.             |
| RNF-05 | Usability     | The catalog can be used without technical knowledge; errors explain how to fix them. |
| RNF-06 | Accessibility | Responsive on desktop, tablet and phone.                                             |
| RNF-09 | Compatibility | Works on modern browsers.                                                            |
| RNF-10 | Integration   | WhatsApp is a link: no automatic messages or automatic payment confirmation.         |

## Out of scope

- Online payments or automatic payment confirmation.
- Automatic WhatsApp messages or replies.
- Automatic stock reservation when an order is placed (RN-12).

## Open questions

- The scope (SRS 1.7.2) talks about **in-store pickup**, but rules RN-29 to
  RN-32 talk about **home delivery**, coverage areas and shipping costs.
  Confirm with the owner whether the first version includes deliveries.
- Which data the customer sign-up asks for (RN-24) and whether guest
  checkout is allowed.
- How a price is shown when a promotion is active (strikethrough price,
  percentage, etc.).
