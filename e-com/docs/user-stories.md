# User stories — Online store

User stories in Connextra format with Gherkin scenarios. Each story belongs
to one epic in [`epics.md`](epics.md) and has at least one positive, one
negative, one error and one validation scenario; each scenario is an
acceptance criterion that needs a test. The API side of each story is in
[`../../backend/docs/user-stories.md`](../../backend/docs/user-stories.md).

Quoted texts inside the scenarios are the exact UI texts, in Spanish, as the
customer sees them. Names and products are examples.

| Story           | Name                                 | Epic                                            |
| --------------- | ------------------------------------ | ----------------------------------------------- |
| [HU-02](#hu-02) | Browse the product catalog           | [EP-06](epics.md#ep-06) Catalog                 |
| [HU-04](#hu-04) | View product details                 | [EP-06](epics.md#ep-06) Catalog                 |
| [HU-03](#hu-03) | Search and filter products           | [EP-07](epics.md#ep-07) Search and filters      |
| [HU-22](#hu-22) | See promotions in the catalog        | [EP-08](epics.md#ep-08) Promotions in the store |
| [HU-05](#hu-05) | Add products to the cart             | [EP-09](epics.md#ep-09) Cart                    |
| [HU-06](#hu-06) | Place an order                       | [EP-10](epics.md#ep-10) Checkout and orders     |
| [HU-23](#hu-23) | Choose pickup or home delivery       | [EP-10](epics.md#ep-10) Checkout and orders     |
| [HU-07](#hu-07) | Coordinate an order through WhatsApp | [EP-11](epics.md#ep-11) WhatsApp coordination   |
| [HU-24](#hu-24) | Sign up as a customer                | [EP-12](epics.md#ep-12) Customer account        |
| [HU-25](#hu-25) | Sign in and out as a customer        | [EP-12](epics.md#ep-12) Customer account        |
| [HU-26](#hu-26) | View my orders                       | [EP-12](epics.md#ep-12) Customer account        |

## EP-06 — Catalog

<a id="hu-02"></a>

### HU-02 — Browse the product catalog

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-06 — Catalog](epics.md#ep-06)                       |
| Source       | SRS                                                     |
| User         | Customer                                                |
| Priority     | High                                                    |
| Risk         | Medium                                                  |
| Sprint       | 3 · Catalog                                             |
| Points       | TBD                                                     |
| Requirements | MO-06                                                   |
| Rules        | RN-02                                                   |
| API          | [HU-02 (API)](../../backend/docs/user-stories.md#hu-02) |

> **As a** customer, **I want** to browse Nativa 360's product catalog,
> **so that** I know which products exist, their price and whether they are
> available.

```gherkin
Feature: Browse the product catalog

  Background:
    Given there are 30 active products with name, image, description, price and stock

  Scenario: Positive – the customer sees the catalog
    Given a customer enters the online store
    When the catalog loads
    Then they see the active products with their image, name and price
    And out-of-stock products show the "Agotado" label

  Scenario: Positive – the catalog is paginated
    Given the catalog shows 20 products per page
    When the customer goes to page 2
    Then they see the remaining 10 products

  Scenario: Negative – disabled products do not appear
    Given the staff disabled the product "Aceite de coco"
    When the customer views the catalog
    Then "Aceite de coco" does not appear in the list

  Scenario: Error – the catalog cannot be loaded
    Given the API does not respond
    When the customer opens the catalog
    Then they see the message "No pudimos cargar los productos. Revisá tu conexión e intentá de nuevo"
    And they see a "Reintentar" button

  Scenario: Validation – page out of range
    Given the catalog has 2 pages of products
    When the customer opens page 50 from the browser address bar
    Then they see the message "No hay más productos para mostrar"
    And a link back to the first page

  Scenario Outline: Availability shown on the card
    Given an active product has <stock> units
    When the customer sees its card in the catalog
    Then the card shows "<label>"

    Examples:
      | stock | label      |
      | 15    | Disponible |
      | 0     | Agotado    |
```

<a id="hu-04"></a>

### HU-04 — View product details

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-06 — Catalog](epics.md#ep-06)                       |
| Source       | SRS                                                     |
| User         | Customer                                                |
| Priority     | High                                                    |
| Risk         | Low                                                     |
| Sprint       | 3 · Catalog                                             |
| Points       | TBD                                                     |
| Requirements | MO-09                                                   |
| Rules        | RN-02                                                   |
| API          | [HU-04 (API)](../../backend/docs/user-stories.md#hu-04) |

> **As a** customer, **I want** to see a product's full details, **so that**
> I can decide whether to add it to my order.

```gherkin
Feature: View product details

  Background:
    Given the active product "Spirulina en polvo" exists and has stock

  Scenario: Positive – the customer sees the details
    Given the customer is on the catalog
    When they open "Spirulina en polvo"
    Then they see its image, name, category, price, full description and availability
    And they see the quantity selector and the "Agregar al carrito" button enabled

  Scenario: Negative – out-of-stock product
    Given "Spirulina en polvo" has no stock
    When the customer opens its details
    Then they see the "Agotado" label
    And the "Agregar al carrito" button is disabled

  Scenario: Negative – disabled product
    Given the staff disabled "Spirulina en polvo"
    When the customer opens a saved link to that product
    Then they see the message "Este producto ya no está disponible"
    And a link back to the catalog

  Scenario: Error – the details cannot be loaded
    Given the API does not respond
    When the customer opens a product's details
    Then they see an error message with the "Reintentar" button

  Scenario: Validation – invalid product id
    Given the customer types the address "/productos/abc" by hand
    When the page loads
    Then they see the "Producto no encontrado" page
    And a link back to the catalog
```

## EP-07 — Search and filters

<a id="hu-03"></a>

### HU-03 — Search and filter products

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-07 — Search and filters](epics.md#ep-07)            |
| Source       | SRS                                                     |
| User         | Customer                                                |
| Priority     | High                                                    |
| Risk         | Medium                                                  |
| Sprint       | 3 · Catalog                                             |
| Points       | TBD                                                     |
| Requirements | MO-07, MO-08                                            |
| Rules        | RN-02                                                   |
| API          | [HU-03 (API)](../../backend/docs/user-stories.md#hu-03) |

> **As a** customer, **I want** to search products by name or feature and
> filter them by category, **so that** I quickly find what I need.

```gherkin
Feature: Search and filter products

  Background:
    Given the categories "Vitaminas", "Tés" and "Cuidado personal" exist
    And there are active products in each category

  Scenario: Positive – search by name
    Given the customer is on the catalog
    When they type "magnesio" in the search box
    Then they only see products whose name or description contains "magnesio"

  Scenario: Positive – combine search and category
    Given the customer searched for "orgánico"
    When they select the "Tés" category
    Then they only see teas that match "orgánico"
    And the search and filter stay in the browser address so it can be shared

  Scenario: Negative – the search has no results
    Given the customer is on the catalog
    When they search for "xyz123"
    Then they see the message "No encontramos productos para «xyz123»"
    And they see a button to clear the search and filters

  Scenario: Negative – the search does not return disabled products
    Given the product "Colágeno marino" is disabled
    When the customer searches for "colágeno"
    Then "Colágeno marino" does not appear in the results

  Scenario: Error – the search fails
    Given the API does not respond
    When the customer searches for "vitamina"
    Then they see an error message with the "Reintentar" button
    And the text they typed stays in the search box

  Scenario Outline: Validation – special search texts
    Given the customer is on the catalog
    When they search for "<text>"
    Then <result>

    Examples:
      | text          | result                                                               |
      |               | they see the whole catalog                                           |
      | (only spaces) | they see the whole catalog                                           |
      | VITAMINA      | they see the same results as with "vitamina"                         |
      | té            | they see the same results as with "te"                               |
      | <b>hola</b>   | they see the no-results message and the text is not rendered as HTML |
```

## EP-08 — Promotions in the store

<a id="hu-22"></a>

### HU-22 — See promotions in the catalog

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-08 — Promotions in the store](epics.md#ep-08)       |
| Source   | Derived from SRS (RN-19, RN-20, RN-21)                  |
| User     | Customer                                                |
| Priority | Medium                                                  |
| Risk     | Medium                                                  |
| Sprint   | 6 · Customers and content                               |
| Points   | TBD                                                     |
| Rules    | RN-19, RN-20, RN-21                                     |
| API      | [HU-22 (API)](../../backend/docs/user-stories.md#hu-22) |

> **As a** customer, **I want** to see which products are on promotion and
> get the promotional price in my order, **so that** I can save money.

```gherkin
Feature: See promotions in the catalog

  Background:
    Given today is 15/11/2026
    And "Vitamina C 1000 mg" costs ₡6 500 and has a 10 % promotion from 01/11 to 30/11

  Scenario: Positive – the promotional price is shown
    Given the customer views the catalog
    When they find "Vitamina C 1000 mg"
    Then the card shows ₡6 500 struck through and ₡5 850
    And a "-10 %" label

  Scenario: Positive – the promotional price is used in the cart
    Given the customer adds 2 units of "Vitamina C 1000 mg" to the cart
    When they open the cart
    Then the subtotal for that product is ₡11 700

  Scenario: Negative – a product outside the promotion keeps its price
    Given "Omega 3" is not part of any promotion
    When the customer views it
    Then they see its regular price without a discount label

  Scenario: Negative – an expired promotion is not applied
    Given the promotion ended on 14/11
    When the customer views "Vitamina C 1000 mg"
    Then they see the regular price ₡6 500

  Scenario: Error – the promotions cannot be loaded
    Given the API cannot calculate the promotions
    When the customer views the catalog
    Then the products are shown with their regular price
    And no wrong discount is shown

  Scenario: Validation – two promotions never stack
    Given "Vitamina C 1000 mg" belongs to a category with a 5 % promotion too
    When the customer views the product
    Then only one discount is applied
```

## EP-09 — Cart

<a id="hu-05"></a>

### HU-05 — Add products to the cart

| Field        | Value                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| Epic         | [EP-09 — Cart](epics.md#ep-09)                                                                    |
| Source       | SRS                                                                                               |
| User         | Customer                                                                                          |
| Priority     | High                                                                                              |
| Risk         | Medium                                                                                            |
| Sprint       | 4 · Cart and orders                                                                               |
| Points       | TBD                                                                                               |
| Requirements | MO-10, MO-11, MO-12, MO-13                                                                        |
| Rules        | RN-02, RN-05                                                                                      |
| API          | None: the cart lives in the browser. The API validates products when the order is placed (HU-06). |

> **As a** customer, **I want** to add products to a cart, change their
> quantities and see the estimated total, **so that** I can prepare my order
> before sending it.

```gherkin
Feature: Add products to the cart

  Background:
    Given the active product "Omega 3" costs ₡8 000 and has 10 units in stock
    And the active product "Té de manzanilla" costs ₡2 500 and has 20 units in stock

  Scenario: Positive – add products and see the total
    Given the cart is empty
    When the customer adds 2 units of "Omega 3"
    And adds 1 unit of "Té de manzanilla"
    Then the cart icon shows 3 products
    And the cart shows an estimated total of ₡18 500

  Scenario: Positive – change the quantity and remove a product
    Given the cart has 2 units of "Omega 3" and 1 of "Té de manzanilla"
    When the customer raises "Omega 3" to 3 units
    And removes "Té de manzanilla"
    Then the cart only shows "Omega 3" with an estimated total of ₡24 000

  Scenario: Positive – the cart is kept when coming back
    Given the customer added products to the cart
    When they close the tab and open the online store again
    Then the cart has the same products and quantities

  Scenario: Negative – out-of-stock product
    Given "Omega 3" has no stock
    When the customer tries to add it to the cart
    Then the "Agregar al carrito" button is disabled
    And the product is not added

  Scenario: Negative – a product in the cart was disabled
    Given the cart has "Té de manzanilla"
    And the staff disabled that product
    When the customer opens the cart
    Then "Té de manzanilla" is marked as "Ya no está disponible"
    And it is not added to the total or included in the order

  Scenario: Error – prices cannot be refreshed
    Given the cart has products
    And the API does not respond
    When the customer opens the cart
    Then they see their products with the last known price
    And a notice that prices will be confirmed when placing the order

  Scenario Outline: Validation – allowed quantities
    Given "Omega 3" has 10 units in stock
    When the customer changes the quantity of "Omega 3" in the cart to <quantity>
    Then <result>

    Examples:
      | quantity | result                                                                   |
      | 5        | the quantity stays at 5                                                  |
      | 0        | they are asked whether to remove the product from the cart               |
      | 11       | the quantity stays at 10 and they see "Solo hay 10 unidades disponibles" |
      | -1       | the quantity does not change                                             |
```

## EP-10 — Checkout and orders

<a id="hu-06"></a>

### HU-06 — Place an order

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-10 — Checkout and orders](epics.md#ep-10)           |
| Source       | SRS                                                     |
| User         | Customer                                                |
| Priority     | High                                                    |
| Risk         | High                                                    |
| Sprint       | 4 · Cart and orders                                     |
| Points       | TBD                                                     |
| Requirements | MO-14                                                   |
| Rules        | RN-05, RN-09, RN-11, RN-12, RN-24                       |
| API          | [HU-06 (API)](../../backend/docs/user-stories.md#hu-06) |

> **As a** customer, **I want** to place an order with the products in my
> cart, **so that** Nativa 360's staff can prepare it and coordinate it with
> me.

```gherkin
Feature: Place an order

  Background:
    Given the customer has 2 units of "Omega 3" at ₡8 000 in the cart
    And there are 10 units of "Omega 3" in stock

  Scenario: Positive – place the order
    Given the customer is signed in
    When they open checkout
    Then they see the summary with products, quantities and an estimated total of ₡16 000
    When they confirm their contact data and press "Registrar pedido"
    Then the order is placed with status "pending"
    And they see the order code and the "Coordinar por WhatsApp" button
    And the cart is emptied

  Scenario: Negative – the customer is not signed in
    Given the customer is not signed in
    When they press "Continuar con el pedido"
    Then they are asked to sign in or sign up
    And afterwards they come back to checkout with the same cart

  Scenario: Negative – there is no longer enough stock
    Given only 1 unit of "Omega 3" is left while the customer was at checkout
    When they press "Registrar pedido"
    Then the order is not placed
    And they see "Solo hay 1 unidad disponible de Omega 3"
    And they can fix the quantity without losing the rest of the cart

  Scenario: Error – the API does not respond when placing the order
    Given the API is unavailable
    When the customer presses "Registrar pedido"
    Then they see "No pudimos registrar tu pedido. Intentá de nuevo en unos minutos"
    And the whole cart is kept

  Scenario: Validation – double click on "Registrar pedido"
    Given the customer is at checkout
    When they press "Registrar pedido" twice in a row
    Then only one order is placed

  Scenario Outline: Validation – contact data
    Given the customer is at checkout
    When they enter the phone "<phone>" and press "Registrar pedido"
    Then <result>

    Examples:
      | phone    | result                                                          |
      | 88887777 | the order is placed                                             |
      |          | they see "El teléfono es obligatorio" and the order is not sent |
      | 1234     | they see "Ingresá un teléfono de 8 dígitos"                     |
      | abcdefgh | they see "Ingresá un teléfono de 8 dígitos"                     |
```

<a id="hu-23"></a>

### HU-23 — Choose pickup or home delivery

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-10 — Checkout and orders](epics.md#ep-10)           |
| Source   | Derived from SRS (RN-29 to RN-32)                       |
| User     | Customer                                                |
| Priority | Medium                                                  |
| Risk     | Medium                                                  |
| Sprint   | 4 · Cart and orders                                     |
| Points   | TBD                                                     |
| Rules    | RN-29, RN-30, RN-31, RN-32                              |
| API      | [HU-23 (API)](../../backend/docs/user-stories.md#hu-23) |

> **As a** customer, **I want** to choose whether I pick up my order at the
> store or get it delivered, **so that** I receive it in the way that suits
> me.

Pending confirmation with the owner: whether home delivery is part of the
first version (the SRS scope talks about in-store pickup, while rules RN-29
to RN-32 describe deliveries).

```gherkin
Feature: Choose pickup or home delivery

  Background:
    Given the customer is signed in and at checkout with ₡16 000 in products

  Scenario: Positive – in-store pickup
    When they choose "Retiro en tienda"
    Then the summary shows "Envío: ₡0"
    And the estimated total stays at ₡16 000

  Scenario: Positive – home delivery inside the coverage area
    When they choose "Envío a domicilio" and enter an address in a covered area
    Then the summary says "El costo de envío se acuerda por WhatsApp antes de confirmar"

  Scenario: Negative – address outside the coverage area
    When they choose "Envío a domicilio" with an area the store does not cover
    Then they see "No hacemos envíos a esa zona. Podés elegir retiro en tienda"
    And they cannot place the order with home delivery

  Scenario: Error – the coverage areas cannot be loaded
    Given the API does not return the coverage areas
    When the customer opens checkout
    Then only "Retiro en tienda" is offered
    And a notice says home delivery is not available right now

  Scenario Outline: Validation – delivery data
    When they choose "Envío a domicilio" and leave the <field> empty
    Then they see "<message>"
    And the order is not placed

    Examples:
      | field            | message                                |
      | address          | La dirección de entrega es obligatoria |
      | delivery contact | El contacto de entrega es obligatorio  |
```

## EP-11 — WhatsApp coordination

<a id="hu-07"></a>

### HU-07 — Coordinate an order through WhatsApp

| Field        | Value                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| Epic         | [EP-11 — WhatsApp coordination](epics.md#ep-11)                           |
| Source       | SRS                                                                       |
| User         | Customer and authorized staff                                             |
| Priority     | High                                                                      |
| Risk         | Medium                                                                    |
| Sprint       | 4 · Cart and orders                                                       |
| Points       | TBD                                                                       |
| Requirements | MO-15                                                                     |
| Rules        | RN-10, RN-11, RN-13, RN-14                                                |
| API          | Only reads the WhatsApp number (`GET /negocio`). No WhatsApp integration. |

> **As a** customer, **I want** to open WhatsApp with my order details
> already written, **so that** I can coordinate availability, payment and
> delivery with Nativa 360's staff.

```gherkin
Feature: Coordinate an order through WhatsApp

  Background:
    Given the store has its WhatsApp number configured
    And the customer placed the order "N360-0042" with 2 units of "Omega 3" for ₡16 000

  Scenario: Positive – open WhatsApp with the order
    Given the customer is on the placed order screen
    When they press "Coordinar por WhatsApp"
    Then WhatsApp opens with the store's number
    And the message, already written, includes the code "N360-0042", the products and the estimated total
    And the customer decides whether to send it

  Scenario: Positive – coordinate again from "Mis pedidos"
    Given the customer closed the order screen
    When they open "N360-0042" from "Mis pedidos"
    Then they see the "Coordinar por WhatsApp" button

  Scenario: Negative – the system does not send messages or confirm payments
    Given the customer opened WhatsApp from their order
    When they send a photo of the payment receipt
    Then the order stays in status "pending"
    And it only changes when the staff verifies the payment in the admin panel

  Scenario: Error – the WhatsApp number is not available
    Given the API does not return the WhatsApp number
    When the customer sees the placed order screen
    Then the "Coordinar por WhatsApp" button is not shown
    And they see the store's fallback phone with their order code

  Scenario Outline: Validation – the message is built correctly with any product name
    Given the order includes the product "<product>"
    When the customer presses "Coordinar por WhatsApp"
    Then the WhatsApp message shows "<product>" without broken characters

    Examples:
      | product                |
      | Té de jengibre & limón |
      | Vitamina D3 + K2       |
      | Aceite 100 % de coco   |
      | Miel de abeja "pura"   |
```

## EP-12 — Customer account

<a id="hu-24"></a>

### HU-24 — Sign up as a customer

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-12 — Customer account](epics.md#ep-12)              |
| Source   | Derived from SRS (RN-24)                                |
| User     | Customer                                                |
| Priority | High                                                    |
| Risk     | Medium                                                  |
| Sprint   | 4 · Cart and orders                                     |
| Points   | TBD                                                     |
| Rules    | RN-24                                                   |
| API      | [HU-24 (API)](../../backend/docs/user-stories.md#hu-24) |

> **As a** customer, **I want** to create an account in the online store,
> **so that** I can place orders and follow them.

```gherkin
Feature: Sign up as a customer

  Scenario: Positive – create an account
    Given a visitor is on "/registro"
    When they enter name "Ana Mora", email "ana@correo.com", phone 88887777 and a valid password
    And press "Crear cuenta"
    Then the account is created
    And they are signed in and go back to the page they came from

  Scenario: Negative – the email is already registered
    Given "ana@correo.com" already has an account
    When a visitor signs up with "ana@correo.com"
    Then they see "Ya existe una cuenta con ese correo. ¿Querés ingresar?"

  Scenario: Error – the authentication service does not respond
    Given Supabase Auth is unavailable
    When the visitor presses "Crear cuenta"
    Then they see "No pudimos crear tu cuenta. Intentá de nuevo en unos minutos"
    And the data they typed is kept, except the password

  Scenario Outline: Validation – sign-up data
    Given a visitor is on "/registro"
    When they enter <data> and press "Crear cuenta"
    Then they see "<message>"

    Examples:
      | data                       | message                                        |
      | an email without "@"       | Ingresá un correo válido                       |
      | a password of 5 characters | La contraseña debe tener al menos 8 caracteres |
      | an empty name              | El nombre es obligatorio                       |
      | a phone of 4 digits        | Ingresá un teléfono de 8 dígitos               |
```

<a id="hu-25"></a>

### HU-25 — Sign in and out as a customer

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-12 — Customer account](epics.md#ep-12)              |
| Source   | Derived from SRS (RNF-01)                               |
| User     | Customer                                                |
| Priority | High                                                    |
| Risk     | Medium                                                  |
| Sprint   | 4 · Cart and orders                                     |
| Points   | TBD                                                     |
| Rules    | RNF-01                                                  |
| API      | [HU-25 (API)](../../backend/docs/user-stories.md#hu-25) |

> **As a** customer, **I want** to sign in and out of my account, **so that**
> only I can see and place orders with it.

```gherkin
Feature: Sign in and out as a customer

  Background:
    Given "ana@correo.com" has a customer account

  Scenario: Positive – sign in
    Given Ana is on "/ingresar"
    When she enters her email and password and presses "Ingresar"
    Then she is signed in and sees "Hola, Ana" in the header

  Scenario: Positive – sign out
    Given Ana is signed in
    When she presses "Cerrar sesión"
    Then she is signed out
    And her cart stays in the browser

  Scenario: Negative – wrong password
    When Ana enters a wrong password
    Then she sees "Correo o contraseña incorrectos"
    And the message does not say which of the two is wrong

  Scenario: Error – the authentication service does not respond
    Given Supabase Auth is unavailable
    When Ana presses "Ingresar"
    Then she sees "No pudimos iniciar sesión. Intentá de nuevo en unos minutos"

  Scenario: Validation – empty fields
    When Ana presses "Ingresar" with the email or password empty
    Then she sees which field is required
    And no request is sent
```

<a id="hu-26"></a>

### HU-26 — View my orders

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-12 — Customer account](epics.md#ep-12)              |
| Source   | Derived from SRS (RN-26)                                |
| User     | Customer                                                |
| Priority | Medium                                                  |
| Risk     | Low                                                     |
| Sprint   | 6 · Customers and content                               |
| Points   | TBD                                                     |
| Rules    | RN-26                                                   |
| API      | [HU-26 (API)](../../backend/docs/user-stories.md#hu-26) |

> **As a** customer, **I want** to see my orders and their status, **so
> that** I know where each one stands without asking.

```gherkin
Feature: View my orders

  Background:
    Given Ana is signed in and has 3 orders

  Scenario: Positive – see the list of orders
    When she opens "Mis pedidos"
    Then she sees her 3 orders with code, date, estimated total and status
    And the most recent one is first

  Scenario: Positive – see an order's status change
    Given the staff moved "N360-0042" to "confirmed"
    When Ana opens "Mis pedidos"
    Then "N360-0042" shows the status "Confirmado"

  Scenario: Negative – another customer's order
    Given the order "N360-0050" belongs to another customer
    When Ana opens "/pedidos/N360-0050" by typing the address
    Then she sees "Pedido no encontrado"

  Scenario: Negative – no orders yet
    Given a new customer with no orders
    When they open "Mis pedidos"
    Then they see "Todavía no tenés pedidos" and a "Ver productos" button

  Scenario: Error – the orders cannot be loaded
    Given the API does not respond
    When Ana opens "Mis pedidos"
    Then she sees an error message with the "Reintentar" button

  Scenario: Validation – without a session
    Given the visitor is not signed in
    When they open "/mis-pedidos"
    Then they are sent to "/ingresar" and come back after signing in
```
