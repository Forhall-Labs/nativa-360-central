# User stories — Administration panel

User stories in Connextra format with Gherkin scenarios. Each story belongs
to one epic in [`epics.md`](epics.md) and has at least one positive, one
negative, one error and one validation scenario; each scenario is an
acceptance criterion that needs a test. The API side of each story is in
[`../../backend/docs/user-stories.md`](../../backend/docs/user-stories.md).

Quoted texts inside the scenarios are the exact UI texts, in Spanish, as the
staff sees them. Names and products are examples.

| Story           | Name                                | Epic                                               |
| --------------- | ----------------------------------- | -------------------------------------------------- |
| [HU-08](#hu-08) | Manage products                     | [EP-13](epics.md#ep-13) Product catalog management |
| [HU-27](#hu-27) | Manage categories                   | [EP-13](epics.md#ep-13) Product catalog management |
| [HU-28](#hu-28) | Manage product images               | [EP-13](epics.md#ep-13) Product catalog management |
| [HU-09](#hu-09) | Manage inventory                    | [EP-14](epics.md#ep-14) Inventory                  |
| [HU-10](#hu-10) | Update an order's status            | [EP-15](epics.md#ep-15) Order management           |
| [HU-12](#hu-12) | View order history                  | [EP-15](epics.md#ep-15) Order management           |
| [HU-29](#hu-29) | Confirm an order's payment          | [EP-16](epics.md#ep-16) Payments and cancellations |
| [HU-30](#hu-30) | Cancel an order and review a refund | [EP-16](epics.md#ep-16) Payments and cancellations |
| [HU-31](#hu-31) | Apply a manual discount to an order | [EP-16](epics.md#ep-16) Payments and cancellations |
| [HU-11](#hu-11) | View customer information           | [EP-17](epics.md#ep-17) Customer management        |
| [HU-13](#hu-13) | Manage promotions and events        | [EP-18](epics.md#ep-18) Site content               |
| [HU-32](#hu-32) | Manage business information         | [EP-18](epics.md#ep-18) Site content               |
| [HU-33](#hu-33) | Manage media content                | [EP-18](epics.md#ep-18) Site content               |
| [HU-14](#hu-14) | Manage doctor visits                | [EP-19](epics.md#ep-19) Doctor visits              |
| [HU-15](#hu-15) | Manage users and permissions        | [EP-20](epics.md#ep-20) Users and access           |
| [HU-34](#hu-34) | Sign in and out of the panel        | [EP-20](epics.md#ep-20) Users and access           |

## EP-13 — Product catalog management

<a id="hu-08"></a>

### HU-08 — Manage products

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-13 — Product catalog management](epics.md#ep-13)    |
| Source       | SRS                                                     |
| User         | Employee or administrator                               |
| Priority     | High                                                    |
| Risk         | Medium                                                  |
| Sprint       | 5 · Store management                                    |
| Points       | TBD                                                     |
| Requirements | MO-16, MO-17, MO-18                                     |
| Rules        | RN-01, RN-02, RN-03, RN-27                              |
| API          | [HU-08 (API)](../../backend/docs/user-stories.md#hu-08) |

> **As an** administrator, **I want** to register, view, edit and disable
> products, **so that** the online catalog always shows the right
> information.

```gherkin
Feature: Manage products

  Background:
    Given the category "Vitaminas" exists
    And the administrator is signed in to the panel

  Scenario: Positive – register a product
    Given the administrator is on "Productos"
    When they press "Nuevo producto"
    And fill in code "VIT-001", name "Vitamina C 1000 mg", description, price ₡6 500, category "Vitaminas" and image
    And press "Guardar"
    Then they see "Producto guardado"
    And "Vitamina C 1000 mg" appears as active in the list and in the online store catalog

  Scenario: Positive – disable a product
    Given the active product "Vitamina C 1000 mg" exists
    When the administrator disables it and confirms
    Then the product becomes "inactive"
    And it no longer appears in the catalog
    But it still appears in the orders that included it

  Scenario: Negative – employees cannot change prices
    Given an employee is signed in
    When they open the product "Vitamina C 1000 mg"
    Then they see the price but cannot edit it
    And if they try to change it some other way, the API answers "No tenés permiso para esta acción"

  Scenario: Negative – duplicate product code
    Given a product with code "VIT-001" already exists
    When the administrator registers another product with code "VIT-001"
    Then they see "Ya existe un producto con el código VIT-001"
    And the product is not saved

  Scenario: Error – saving the product fails
    Given the API does not respond
    When the administrator presses "Guardar"
    Then they see "No se pudo guardar el producto. Intentá de nuevo"
    And the form data is kept

  Scenario Outline: Validation – product fields
    Given the administrator is registering a product
    When they leave the <field> field with the value "<value>" and press "Guardar"
    Then they see "<message>"
    And the product is not saved

    Examples:
      | field       | value | message                       |
      | name        |       | El nombre es obligatorio      |
      | description |       | La descripción es obligatoria |
      | price       | 0     | El precio debe ser mayor a 0  |
      | price       | -500  | El precio debe ser mayor a 0  |
      | image       |       | La imagen es obligatoria      |
```

<a id="hu-27"></a>

### HU-27 — Manage categories

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-13 — Product catalog management](epics.md#ep-13)    |
| Source       | Derived from SRS (MO-08)                                |
| User         | Administrator                                           |
| Priority     | Medium                                                  |
| Risk         | Low                                                     |
| Sprint       | 5 · Store management                                    |
| Points       | TBD                                                     |
| Requirements | MO-08                                                   |
| API          | [HU-27 (API)](../../backend/docs/user-stories.md#hu-27) |

> **As an** administrator, **I want** to create, rename and disable product
> categories, **so that** customers can filter the catalog by them.

```gherkin
Feature: Manage categories

  Background:
    Given the administrator is signed in to the panel

  Scenario: Positive – create a category
    Given the administrator is on "Productos > Categorías"
    When they create the category "Superalimentos"
    Then it appears in the list as active
    And it is available as a filter in the online store

  Scenario: Positive – rename a category
    Given the category "Te" exists
    When the administrator renames it to "Tés e infusiones"
    Then the products of that category keep it with the new name

  Scenario: Negative – disable a category that has active products
    Given the category "Vitaminas" has 12 active products
    When the administrator tries to disable it
    Then they see "Esta categoría tiene 12 productos activos. Movelos o deshabilitalos primero"
    And the category stays active

  Scenario: Negative – an employee cannot manage categories
    Given an employee is signed in
    When they open "Productos"
    Then they do not see the "Categorías" option

  Scenario: Error – saving the category fails
    Given the API does not respond
    When the administrator saves a category
    Then they see "No se pudo guardar la categoría. Intentá de nuevo"

  Scenario Outline: Validation – category name
    When the administrator saves a category named "<name>"
    Then <result>

    Examples:
      | name           | result                                            |
      | Superalimentos | it is saved                                       |
      |                | they see "El nombre es obligatorio"               |
      | vitaminas      | they see "Ya existe una categoría con ese nombre" |
```

<a id="hu-28"></a>

### HU-28 — Manage product images

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-13 — Product catalog management](epics.md#ep-13)    |
| Source       | Derived from SRS (MO-19)                                |
| User         | Administrator or authorized staff                       |
| Priority     | Medium                                                  |
| Risk         | Medium                                                  |
| Sprint       | 5 · Store management                                    |
| Points       | TBD                                                     |
| Requirements | MO-19                                                   |
| Rules        | RN-03                                                   |
| API          | [HU-28 (API)](../../backend/docs/user-stories.md#hu-28) |

> **As an** administrator, **I want** to upload and change a product's image,
> **so that** customers see what they are buying.

```gherkin
Feature: Manage product images

  Background:
    Given the product "Omega 3" exists
    And the administrator is signed in to the panel

  Scenario: Positive – change the image
    Given the administrator opens "Omega 3"
    When they upload a new JPG image of 800 KB
    Then they see a preview of the new image
    And after pressing "Guardar" the catalog shows the new image

  Scenario: Negative – the image cannot be removed without a replacement
    Given "Omega 3" has an image
    When the administrator removes it without uploading another one
    Then they see "La imagen es obligatoria"
    And the product keeps its previous image

  Scenario: Error – the upload fails
    Given the storage service does not respond
    When the administrator uploads an image
    Then they see "No se pudo subir la imagen. Intentá de nuevo"
    And the rest of the form data is kept

  Scenario Outline: Validation – image file
    When the administrator uploads a <file>
    Then <result>

    Examples:
      | file                | result                                                   |
      | JPG of 800 KB       | it is accepted                                           |
      | PNG of 1.5 MB       | it is accepted                                           |
      | PDF                 | they see "El archivo debe ser una imagen JPG, PNG o WebP" |
      | JPG of 8 MB         | they see "La imagen no puede pesar más de 5 MB"          |
```

## EP-14 — Inventory

<a id="hu-09"></a>

### HU-09 — Manage inventory

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-14 — Inventory](epics.md#ep-14)                     |
| Source       | SRS                                                     |
| User         | Employee or administrator                               |
| Priority     | High                                                    |
| Risk         | High                                                    |
| Sprint       | 5 · Store management                                    |
| Points       | TBD                                                     |
| Requirements | MO-22                                                   |
| Rules        | RN-04, RN-06, RN-27                                     |
| API          | [HU-09 (API)](../../backend/docs/user-stories.md#hu-09) |

> **As an** employee, **I want** to view and update product stock by
> recording entries, exits and adjustments, **so that** the catalog shows
> the real availability.

```gherkin
Feature: Manage inventory

  Background:
    Given the product "Omega 3" has 10 units in stock
    And an employee is signed in to the panel

  Scenario: Positive – record a stock entry
    Given the employee is on "Inventario"
    When they record an entry of 24 units of "Omega 3" with the reason "Pedido al proveedor"
    Then "Omega 3" has 34 units in stock
    And the movement is recorded with their name, the date and the reason

  Scenario: Positive – view the movement history
    Given "Omega 3" has several recorded movements
    When the employee opens its history
    Then they see each movement with type, quantity, reason, user and date

  Scenario: Negative – exit larger than the stock
    Given the employee is on "Inventario"
    When they record an exit of 15 units of "Omega 3"
    Then they see "No se puede sacar más de lo disponible (10 unidades)"
    And the stock does not change

  Scenario: Negative – employees cannot change the price from inventory
    Given the employee is recording a movement
    When they look at the form
    Then there is no field to change the product's price

  Scenario: Error – saving the movement fails
    Given the API does not respond
    When the employee records an entry of 24 units
    Then they see "No se pudo guardar el movimiento. Intentá de nuevo"
    And the stock shown is still 10

  Scenario Outline: Validation – movement data
    Given the employee is recording a movement of type "<type>"
    When they enter the quantity "<quantity>" and the reason "<reason>"
    Then <result>

    Examples:
      | type       | quantity | reason           | result                                           |
      | entry      | 5        | Compra           | the movement is saved                            |
      | exit       | 2        | Producto vencido | the movement is saved                            |
      | adjustment | 8        | Conteo físico    | the stock becomes 8                              |
      | entry      | 0        | Compra           | they see "La cantidad debe ser mayor a 0"        |
      | entry      | 5        |                  | they see "El motivo es obligatorio"              |
      | entry      | 2,5      | Compra           | they see "La cantidad debe ser un número entero" |
```

## EP-15 — Order management

<a id="hu-10"></a>

### HU-10 — Update an order's status

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-15 — Order management](epics.md#ep-15)              |
| Source       | SRS                                                     |
| User         | Employee or administrator                               |
| Priority     | High                                                    |
| Risk         | Medium                                                  |
| Sprint       | 5 · Store management                                    |
| Points       | TBD                                                     |
| Requirements | MO-23, MO-24                                            |
| Rules        | RN-10, RN-13                                            |
| API          | [HU-10 (API)](../../backend/docs/user-stories.md#hu-10) |

> **As an** employee, **I want** to view orders and update their status as
> they are handled, **so that** the whole team and the customer know where
> each order stands.

```gherkin
Feature: Update an order's status

  Background:
    Given the order "N360-0042" exists in status "pending" for ₡16 000
    And an employee is signed in to the panel

  Scenario: Positive – move the order forward
    Given the employee opens the order "N360-0042"
    When they change the status to "in review" with the note "Coordinando por WhatsApp"
    Then the order is "in review"
    And the order history shows the change with their name, the date and the note
    And the customer sees the new status in "Mis pedidos"

  Scenario: Positive – mark a paid order as prepared and delivered
    Given the order "N360-0042" is "confirmed"
    When the employee moves it to "prepared" and then to "delivered"
    Then the order is "delivered"

  Scenario: Negative – status change not allowed
    Given the order "N360-0042" is "delivered"
    When the employee tries to move it to "pending"
    Then they see "Un pedido entregado no puede cambiar de estado"
    And the status does not change

  Scenario: Error – saving the change fails
    Given the API does not respond
    When the employee changes the status of "N360-0042"
    Then they see "No se pudo actualizar el estado. Intentá de nuevo"
    And the order still shows "pending"

  Scenario Outline: Validation – status transitions
    Given an order is in status "<current>"
    When the employee tries to move it to "<new>"
    Then the change <result>

    Examples:
      | current   | new       | result      |
      | pending   | in review | is saved    |
      | confirmed | prepared  | is saved    |
      | prepared  | delivered | is saved    |
      | pending   | delivered | is rejected |
      | cancelled | confirmed | is rejected |
```

Moving an order to "confirmed" is the payment confirmation:
[HU-29](#hu-29). Cancelling is [HU-30](#hu-30).

<a id="hu-12"></a>

### HU-12 — View order history

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-15 — Order management](epics.md#ep-15)              |
| Source       | SRS                                                     |
| User         | Employee, administrator or owner                        |
| Priority     | Medium                                                  |
| Risk         | Medium                                                  |
| Sprint       | 6 · Customers and content                               |
| Points       | TBD                                                     |
| Requirements | MO-23, MO-25                                            |
| Rules        | RN-09                                                   |
| API          | [HU-12 (API)](../../backend/docs/user-stories.md#hu-12) |

> **As the** owner, **I want** to view the order history filtered by date,
> customer and status, **so that** I know how the business is doing and can
> review past orders.

```gherkin
Feature: View order history

  Background:
    Given there are orders from October and November in different statuses
    And an administrator is signed in to the panel

  Scenario: Positive – filter the history
    Given the administrator is on "Pedidos"
    When they filter by status "delivered" between 01/10 and 31/10
    Then they only see the orders delivered in October
    And each one shows customer, products, quantities, estimated total, date and status

  Scenario: Positive – the historical price does not change
    Given the order "N360-0010" included "Omega 3" at ₡8 000
    And the price of "Omega 3" later went up to ₡9 000
    When the administrator opens "N360-0010"
    Then they see "Omega 3" at ₡8 000

  Scenario: Negative – the history cannot be deleted
    Given the administrator opens a delivered order
    When they look for an option to delete it
    Then that option does not exist
    And they can only view the order and its status history

  Scenario: Negative – no results
    Given there are no cancelled orders in October
    When the administrator filters by status "cancelled" in October
    Then they see "No hay pedidos con esos filtros"

  Scenario: Error – the history cannot be loaded
    Given the API does not respond
    When the administrator opens "Pedidos"
    Then they see "No se pudo cargar el historial" with the "Reintentar" button
    And the selected filters are kept

  Scenario Outline: Validation – date range
    Given the administrator is on "Pedidos"
    When they filter from "<from>" to "<to>"
    Then <result>

    Examples:
      | from       | to         | result                                                    |
      | 01/10/2026 | 31/10/2026 | they see October's orders                                 |
      | 31/10/2026 | 01/10/2026 | they see "La fecha final debe ser posterior a la inicial" |
      | 01/10/2026 |            | they see the orders from 01/10/2026 until today           |
      | 32/10/2026 | 31/10/2026 | they see "Ingresá una fecha válida"                       |
```

## EP-16 — Payments and cancellations

<a id="hu-29"></a>

### HU-29 — Confirm an order's payment

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-16 — Payments and cancellations](epics.md#ep-16)    |
| Source   | Derived from SRS (RN-14 to RN-17)                       |
| User     | Administrator or authorized employee                    |
| Priority | High                                                    |
| Risk     | High                                                    |
| Sprint   | 5 · Store management                                    |
| Points   | TBD                                                     |
| Rules    | RN-14, RN-15, RN-16, RN-17                              |
| API      | [HU-29 (API)](../../backend/docs/user-stories.md#hu-29) |

> **As an** authorized employee, **I want** to confirm an order's payment only
> after checking that the money arrived, **so that** no order is prepared or
> shipped without being paid.

```gherkin
Feature: Confirm an order's payment

  Background:
    Given the order "N360-0042" is "in review" with a total of ₡16 000
    And an authorized employee is signed in to the panel

  Scenario: Positive – confirm a verified payment
    Given the employee checked the bank and ₡16 000 arrived
    When they press "Confirmar pago", enter the amount ₡16 000 and the reference "SINPE 12345"
    Then the order becomes "confirmed"
    And the history records the amount, reference, employee and date

  Scenario: Negative – a receipt alone is not enough
    Given the customer sent a receipt over WhatsApp
    When the employee tries to confirm without entering the received amount
    Then they see "Ingresá el monto recibido para confirmar el pago"

  Scenario: Negative – an employee without permission
    Given an employee without payment permission is signed in
    When they open "N360-0042"
    Then they do not see the "Confirmar pago" button

  Scenario: Negative – an unpaid order cannot be shipped
    Given the order "N360-0042" is still "in review"
    When the employee tries to move it to "prepared"
    Then they see "Primero hay que confirmar el pago"

  Scenario: Error – saving the confirmation fails
    Given the API does not respond
    When the employee confirms the payment
    Then they see "No se pudo confirmar el pago. Intentá de nuevo"
    And the order stays "in review"

  Scenario Outline: Validation – amount received
    When the employee enters the amount <amount>
    Then <result>

    Examples:
      | amount  | result                                                         |
      | ₡16 000 | the payment is confirmed                                       |
      | ₡10 000 | they see "El monto no coincide con el total del pedido (₡16 000)" |
      | ₡0      | they see "El monto debe ser mayor a 0"                         |
```

<a id="hu-30"></a>

### HU-30 — Cancel an order and review a refund

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-16 — Payments and cancellations](epics.md#ep-16)    |
| Source   | Derived from SRS (RN-33)                                |
| User     | Administrator or authorized employee                    |
| Priority | Medium                                                  |
| Risk     | Medium                                                  |
| Sprint   | 5 · Store management                                    |
| Points   | TBD                                                     |
| Rules    | RN-33                                                   |
| API      | [HU-30 (API)](../../backend/docs/user-stories.md#hu-30) |

> **As an** administrator, **I want** to cancel orders and record what
> happens with the refund when they were already paid, **so that** no money
> is lost along the way.

```gherkin
Feature: Cancel an order and review a refund

  Background:
    Given the administrator is signed in to the panel

  Scenario: Positive – cancel an unpaid order
    Given the order "N360-0043" is "pending"
    When the administrator cancels it with the note "El cliente desistió"
    Then the order becomes "cancelled"

  Scenario: Positive – cancel a paid order with a refund note
    Given the order "N360-0042" is "confirmed"
    When the administrator cancels it with the refund note "Reembolso por SINPE 98765"
    Then the order becomes "cancelled"
    And the history shows the refund note

  Scenario: Negative – a paid order without a refund note
    Given the order "N360-0042" is "confirmed"
    When the administrator tries to cancel it without a refund note
    Then they see "Este pedido ya fue pagado: requiere revisar el reembolso"
    And the order is not cancelled

  Scenario: Negative – a delivered order cannot be cancelled
    Given the order "N360-0040" is "delivered"
    When the administrator opens it
    Then the "Cancelar pedido" button is not shown

  Scenario: Error – saving the cancellation fails
    Given the API does not respond
    When the administrator confirms the cancellation
    Then they see "No se pudo cancelar el pedido. Intentá de nuevo"

  Scenario: Validation – the cancellation is confirmed
    When the administrator presses "Cancelar pedido"
    Then a dialog asks "¿Seguro que querés cancelar el pedido N360-0043?"
    And nothing changes until they confirm
```

<a id="hu-31"></a>

### HU-31 — Apply a manual discount to an order

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-16 — Payments and cancellations](epics.md#ep-16)    |
| Source   | Derived from SRS (RN-23)                                |
| User     | Administrator                                           |
| Priority | Low                                                     |
| Risk     | Medium                                                  |
| Sprint   | 5 · Store management                                    |
| Points   | TBD                                                     |
| Rules    | RN-23, RN-27                                            |
| API      | [HU-31 (API)](../../backend/docs/user-stories.md#hu-31) |

> **As an** administrator, **I want** to apply a manual discount to an order,
> **so that** I can honor special agreements with a customer.

```gherkin
Feature: Apply a manual discount to an order

  Background:
    Given the order "N360-0042" is "in review" with a total of ₡16 000

  Scenario: Positive – apply a discount
    Given the administrator is signed in
    When they apply a discount of ₡1 000 with the reason "Cliente frecuente"
    Then the order total becomes ₡15 000
    And the history records the discount, reason, administrator and date

  Scenario: Negative – employees cannot apply discounts
    Given an employee is signed in
    When they open "N360-0042"
    Then they do not see the "Aplicar descuento" option

  Scenario: Negative – a confirmed order cannot be discounted
    Given the order "N360-0042" is "confirmed"
    When the administrator opens it
    Then the "Aplicar descuento" option is disabled

  Scenario: Error – saving the discount fails
    Given the API does not respond
    When the administrator applies the discount
    Then they see "No se pudo aplicar el descuento. Intentá de nuevo"
    And the total stays at ₡16 000

  Scenario Outline: Validation – discount amount and reason
    When the administrator applies a discount of <amount> with the reason "<reason>"
    Then <result>

    Examples:
      | amount  | reason            | result                                                 |
      | ₡1 000  | Cliente frecuente | the discount is applied                                |
      | ₡0      | Cliente frecuente | they see "El descuento debe ser mayor a 0"             |
      | ₡20 000 | Cliente frecuente | they see "El descuento no puede superar el total"      |
      | ₡1 000  |                   | they see "El motivo del descuento es obligatorio"      |
```

## EP-17 — Customer management

<a id="hu-11"></a>

### HU-11 — View customer information

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-17 — Customer management](epics.md#ep-17)           |
| Source       | SRS                                                     |
| User         | Employee or administrator                               |
| Priority     | Medium                                                  |
| Risk         | Medium                                                  |
| Sprint       | 6 · Customers and content                               |
| Points       | TBD                                                     |
| Requirements | MO-25                                                   |
| Rules        | RN-26                                                   |
| API          | [HU-11 (API)](../../backend/docs/user-stories.md#hu-11) |

> **As an** employee, **I want** to look up customers' contact data and their
> orders, **so that** I can serve them and coordinate their orders faster.

```gherkin
Feature: View customer information

  Background:
    Given the customer "Ana Mora" has an account, phone 88887777 and 3 placed orders
    And an employee is signed in to the panel

  Scenario: Positive – find a customer and see their information
    Given the employee is on "Clientes"
    When they search for "Ana"
    And open "Ana Mora"
    Then they see her name, email, phone and address
    And they see her 3 orders with code, date, total and status

  Scenario: Negative – user without permission
    Given the owner is signed in without administrative permissions
    When they try to open "Clientes"
    Then they see "No tenés permiso para esta acción"
    And they do not see any customer data

  Scenario: Negative – the search finds no customers
    Given the employee is on "Clientes"
    When they search for "Zzz"
    Then they see "No hay clientes que coincidan con «Zzz»"

  Scenario: Error – the list cannot be loaded
    Given the API does not respond
    When the employee opens "Clientes"
    Then they see "No se pudieron cargar los clientes" with the "Reintentar" button

  Scenario Outline: Validation – search criteria
    Given the employee is on "Clientes"
    When they search by <criterion> with the value "<value>"
    Then <result>

    Examples:
      | criterion | value          | result                          |
      | name      | ana            | they find "Ana Mora"            |
      | phone     | 8888-7777      | they find "Ana Mora"            |
      | email     | ANA@CORREO.COM | they find "Ana Mora"            |
      | name      | (only spaces)  | they see the full customer list |
```

## EP-18 — Site content

<a id="hu-13"></a>

### HU-13 — Manage promotions and events

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-18 — Site content](epics.md#ep-18)                  |
| Source       | SRS                                                     |
| User         | Administrator or authorized staff                       |
| Priority     | Medium                                                  |
| Risk         | Medium                                                  |
| Sprint       | 6 · Customers and content                               |
| Points       | TBD                                                     |
| Requirements | MO-21                                                   |
| Rules        | RN-19, RN-20, RN-21, RN-37, RN-38                       |
| API          | [HU-13 (API)](../../backend/docs/user-stories.md#hu-13) |

> **As an** administrator, **I want** to create, edit and disable promotions
> and events, **so that** I can share the store's news on the website.

```gherkin
Feature: Manage promotions and events

  Background:
    Given the active product "Vitamina C 1000 mg" exists
    And the administrator is signed in to the panel

  Scenario: Positive – create an active promotion
    Given the administrator is on "Contenido > Promociones"
    When they create the promotion "10 % en Vitamina C" for "Vitamina C 1000 mg" from 01/11 to 30/11
    Then the promotion is active
    And from 01/11 to 30/11 the online store shows the discounted price
    And from 01/12 it stops showing on its own

  Scenario: Positive – publish an in-person event
    Given the administrator is on "Contenido > Eventos"
    When they create the event "Charla de alimentación consciente" on 20/11 from 17:00 to 18:30 at "Local de Nativa 360"
    Then the event is published with its date, time and location

  Scenario: Negative – two promotions on the same product
    Given "Vitamina C 1000 mg" already has a promotion from 01/11 to 30/11
    When the administrator creates another promotion for that product from 15/11 to 20/11
    Then they see "Este producto ya tiene una promoción en esas fechas"
    And the new promotion is not saved

  Scenario: Negative – unpublished content
    Given the event "Charla de alimentación consciente" is published
    When the administrator disables it
    Then the event is no longer shown on the site

  Scenario: Error – saving the promotion fails
    Given the API does not respond
    When the administrator saves a promotion
    Then they see "No se pudo guardar la promoción. Intentá de nuevo"
    And the form data is kept

  Scenario Outline: Validation – dates and required data
    Given the administrator is creating a <type>
    When they enter <data>
    Then they see "<message>"
    And it is not saved

    Examples:
      | type      | data                                  | message                                      |
      | promotion | end date 01/11 and start date 30/11   | La fecha de fin debe ser posterior al inicio |
      | promotion | a 0 % discount                        | El descuento debe ser mayor a 0              |
      | promotion | a 120 % discount                      | El descuento no puede ser mayor a 100 %      |
      | event     | an in-person event without a location | Indicá la ubicación del evento               |
      | event     | end time 16:00 and start time 17:00   | La hora de fin debe ser posterior al inicio  |
```

<a id="hu-32"></a>

### HU-32 — Manage business information

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-18 — Site content](epics.md#ep-18)                  |
| Source       | Derived from SRS (MO-20)                                |
| User         | Administrator                                           |
| Priority     | Medium                                                  |
| Risk         | Low                                                     |
| Sprint       | 6 · Customers and content                               |
| Points       | TBD                                                     |
| Requirements | MO-20                                                   |
| API          | [HU-32 (API)](../../backend/docs/user-stories.md#hu-32) |

> **As an** administrator, **I want** to update the business information shown
> on the website (description, address, phone, WhatsApp, opening hours and
> social media), **so that** customers always find correct data.

```gherkin
Feature: Manage business information

  Background:
    Given the administrator is signed in to the panel

  Scenario: Positive – update the opening hours
    Given the administrator is on "Contenido > Información del negocio"
    When they change the opening hours to "Lunes a sábado, 8:00 a 18:00" and press "Guardar"
    Then they see "Cambios guardados"
    And the landing page shows the new hours after its next revalidation

  Scenario: Negative – an employee cannot edit it
    Given an employee is signed in
    When they look at the "Contenido" menu
    Then they do not see "Información del negocio"

  Scenario: Error – saving fails
    Given the API does not respond
    When the administrator presses "Guardar"
    Then they see "No se pudieron guardar los cambios. Intentá de nuevo"
    And the form data is kept

  Scenario Outline: Validation – business data
    When the administrator enters <field> "<value>" and presses "Guardar"
    Then <result>

    Examples:
      | field         | value                     | result                                         |
      | phone         | 2771-1234                 | it is saved                                    |
      | phone         | 12                        | they see "Ingresá un teléfono de 8 dígitos"    |
      | WhatsApp      |                           | they see "El número de WhatsApp es obligatorio" |
      | Instagram URL | instagram                 | they see "Ingresá un enlace válido"            |
```

<a id="hu-33"></a>

### HU-33 — Manage media content

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-18 — Site content](epics.md#ep-18)                  |
| Source       | Derived from SRS (MO-21, product backlog)               |
| User         | Administrator or authorized staff                       |
| Priority     | Low                                                     |
| Risk         | Medium                                                  |
| Sprint       | 6 · Customers and content                               |
| Points       | TBD                                                     |
| Requirements | MO-21                                                   |
| Rules        | RN-39, RN-40, RN-41, RN-42                              |
| API          | [HU-33 (API)](../../backend/docs/user-stories.md#hu-33) |

> **As an** administrator, **I want** to publish images and videos about the
> store with a publication period, **so that** the site shows fresh content
> without manual cleanup.

```gherkin
Feature: Manage media content

  Background:
    Given the administrator is signed in to the panel

  Scenario: Positive – publish a video with a period
    Given the administrator is on "Contenido > Multimedia"
    When they publish "Receta de batido verde" with a video link from 01/11 to 30/11
    Then the content is shown on the site from 01/11 to 30/11
    And it disappears on its own on 01/12

  Scenario: Positive – withdraw content
    Given "Receta de batido verde" is published
    When the administrator withdraws it
    Then it is no longer shown on the site

  Scenario: Negative – an employee without permission cannot publish
    Given an employee without content permission is signed in
    When they open "Contenido"
    Then they do not see "Multimedia"

  Scenario: Error – the image upload fails
    Given the storage service does not respond
    When the administrator uploads an image
    Then they see "No se pudo subir la imagen. Intentá de nuevo"

  Scenario Outline: Validation – content data
    When the administrator saves content with <data>
    Then they see "<message>"

    Examples:
      | data                                  | message                                      |
      | an empty title                        | El título es obligatorio                     |
      | end date 01/11 and start date 30/11   | La fecha de fin debe ser posterior al inicio |
      | a video link that is not a URL        | Ingresá un enlace válido                     |
```

## EP-19 — Doctor visits

<a id="hu-14"></a>

### HU-14 — Manage doctor visits

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-19 — Doctor visits](epics.md#ep-19)                 |
| Source       | SRS                                                     |
| User         | Administrator or authorized staff                       |
| Priority     | Medium                                                  |
| Risk         | Medium                                                  |
| Sprint       | 6 · Customers and content                               |
| Points       | 5                                                       |
| Requirements | MO-27                                                   |
| Rules        | RN-34, RN-35, RN-36                                     |
| API          | [HU-14 (API)](../../backend/docs/user-stories.md#hu-14) |

> **As an** administrator, **I want** to register, publish, edit and withdraw
> doctor visits, **so that** customers know which days and at what time they
> can see the doctor at the store.

```gherkin
Feature: Manage doctor visits

  Background:
    Given the administrator is signed in to the panel

  Scenario: Positive – register and publish a visit
    Given the administrator is on "Visitas del doctor"
    When they register "Dr. Luis Vargas", specialty "Medicina natural", on 22/11 from 09:00 to 12:00
    And mark it as "confirmed"
    Then the visit is published
    And the landing page shows it under "Visitas del doctor"

  Scenario: Positive – change the time
    Given the visit on 22/11 is published from 09:00 to 12:00
    When the administrator changes the time to 10:00 to 13:00
    Then the landing page shows the new time

  Scenario: Negative – an unconfirmed visit is not published
    Given the administrator registered a visit with status "pending confirmation"
    When a customer opens the landing page
    Then that visit does not appear

  Scenario: Negative – a cancelled visit is no longer announced
    Given the visit on 22/11 is published
    When the administrator cancels it
    Then the landing page stops showing it

  Scenario: Error – saving the visit fails
    Given the API does not respond
    When the administrator saves a visit
    Then they see "No se pudo guardar la visita. Intentá de nuevo"
    And the form data is kept

  Scenario Outline: Validation – visit data
    Given the administrator is registering a visit
    When they enter <data>
    Then they see "<message>"
    And the visit is not saved

    Examples:
      | data                                | message                                           |
      | start time 12:00 and end time 09:00 | La hora de fin debe ser posterior al inicio       |
      | start time 09:00 and end time 09:00 | La hora de fin debe ser posterior al inicio       |
      | an empty doctor name                | El nombre del doctor es obligatorio               |
      | an empty specialty                  | La especialidad es obligatoria                    |
      | a date before today                 | La fecha de la visita no puede estar en el pasado |
```

## EP-20 — Users and access

<a id="hu-15"></a>

### HU-15 — Manage users and permissions

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-20 — Users and access](epics.md#ep-20)              |
| Source       | SRS                                                     |
| User         | Administrator                                           |
| Priority     | High                                                    |
| Risk         | High                                                    |
| Sprint       | 7 · Integration and security                            |
| Points       | TBD                                                     |
| Requirements | MO-26                                                   |
| Rules        | RN-27, RN-28                                            |
| API          | [HU-15 (API)](../../backend/docs/user-stories.md#hu-15) |

> **As an** administrator, **I want** to register, edit, enable or disable
> staff accounts and assign them a role, **so that** each person only uses
> the features that belong to them.

```gherkin
Feature: Manage users and permissions

  Background:
    Given the administrator is signed in to the panel

  Scenario: Positive – create a user with the employee role
    Given the administrator is on "Usuarios"
    When they create "María Solís" with the email "maria@nativa360.com" and the role "employee"
    Then the account is active
    And María can sign in and only sees Pedidos, Productos, Inventario and Clientes

  Scenario: Negative – an employee cannot manage users
    Given María is signed in with the role "employee"
    When she tries to open "/usuarios" by typing the address
    Then she sees "No tenés permiso para esta acción"

  Scenario: Negative – the administrator cannot remove their own role
    Given the administrator is the only user with the role "administrator"
    When they try to change their own role to "employee"
    Then they see "Tiene que quedar al menos un administrador"
    And their role does not change

  Scenario: Error – creating the user fails
    Given the authentication service does not respond
    When the administrator creates a user
    Then they see "No se pudo crear el usuario. Intentá de nuevo"

  Scenario Outline: Validation – user data
    Given the administrator is creating a user
    When they enter the email "<email>"
    Then <result>

    Examples:
      | email               | result                                         |
      | pedro@nativa360.com | the user is created                            |
      | maria@nativa360.com | they see "Ya existe un usuario con ese correo" |
      | pedro@              | they see "Ingresá un correo válido"            |
      |                     | they see "El correo es obligatorio"            |

  Scenario Outline: Permissions by role
    Given a user with the role "<role>" is signed in
    When they try to <action>
    Then the action <result>

    Examples:
      | role          | action                   | result      |
      | administrator | change a product's price | is allowed  |
      | employee      | change a product's price | is rejected |
      | employee      | update stock             | is allowed  |
      | employee      | assign a role            | is rejected |
      | administrator | assign a role            | is allowed  |
```

<a id="hu-34"></a>

### HU-34 — Sign in and out of the panel

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-20 — Users and access](epics.md#ep-20)              |
| Source   | Derived from SRS (section 4.8)                          |
| User     | Administrator, employee, owner                          |
| Priority | High                                                    |
| Risk     | High                                                    |
| Sprint   | 7 · Integration and security                            |
| Points   | TBD                                                     |
| Rules    | RNF-01                                                  |
| API      | [HU-34 (API)](../../backend/docs/user-stories.md#hu-34) |

> **As** Nativa 360 staff, **I want** to sign in to the panel with my own
> account and sign out when I finish, **so that** nobody else can use my
> access from the store's computer.

```gherkin
Feature: Sign in and out of the panel

  Background:
    Given María has an active account with the role "employee"

  Scenario: Positive – sign in
    Given María is on "/login"
    When she enters her email and password and presses "Ingresar"
    Then she enters the panel and sees her name and role in the top bar

  Scenario: Positive – sign out
    Given María is signed in
    When she presses "Cerrar sesión"
    Then she goes back to the sign-in screen
    And she cannot return to the panel with the browser's "Back" button

  Scenario: Negative – a disabled user cannot sign in
    Given the administrator disabled María's account
    When María tries to sign in
    Then she sees "Tu cuenta está deshabilitada. Consultá con el administrador"

  Scenario: Negative – a customer account cannot enter the panel
    Given "ana@correo.com" is only a customer of the online store
    When Ana tries to sign in to the panel
    Then she sees "Esta cuenta no tiene acceso al panel"

  Scenario: Error – the authentication service does not respond
    Given Supabase Auth is unavailable
    When María tries to sign in
    Then she sees "No se pudo iniciar sesión. Intentá de nuevo en unos minutos"
    And the password is neither shown nor stored in the browser

  Scenario: Validation – expired session
    Given María's session expired while she was editing a product
    When she presses "Guardar"
    Then she is sent to "/login"
    And after signing in she comes back to the same screen
```
