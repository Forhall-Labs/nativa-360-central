# User stories — API (backend)

The API side of the user stories, with Gherkin scenarios. Each story keeps
the HU code of its frontend story, belongs to one epic in
[`epics.md`](epics.md) and has at least one positive, one negative, one
error and one validation scenario; each scenario is an acceptance criterion
that needs a unit or e2e test.

Every error response uses the standard error format described in
[`system-design.md`](system-design.md).

| Story           | Name                                | Epic                                                         |
| --------------- | ----------------------------------- | ------------------------------------------------------------ |
| [HU-01](#hu-01) | View business information           | [EP-21](epics.md#ep-21) Business information API             |
| [HU-32](#hu-32) | Manage business information         | [EP-21](epics.md#ep-21) Business information API             |
| [HU-02](#hu-02) | Browse the product catalog          | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-03](#hu-03) | Search and filter products          | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-04](#hu-04) | View product details                | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-16](#hu-16) | View featured products              | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-22](#hu-22) | See promotions in the catalog       | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-08](#hu-08) | Manage products                     | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-27](#hu-27) | Manage categories                   | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-28](#hu-28) | Manage product images               | [EP-22](epics.md#ep-22) Catalog API                          |
| [HU-09](#hu-09) | Manage inventory                    | [EP-23](epics.md#ep-23) Inventory API                        |
| [HU-06](#hu-06) | Place an order                      | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-23](#hu-23) | Choose pickup or home delivery      | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-26](#hu-26) | View my orders                      | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-10](#hu-10) | Update an order's status            | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-12](#hu-12) | View order history                  | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-29](#hu-29) | Confirm an order's payment          | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-30](#hu-30) | Cancel an order and review a refund | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-31](#hu-31) | Apply a manual discount to an order | [EP-24](epics.md#ep-24) Orders API                           |
| [HU-24](#hu-24) | Sign up as a customer               | [EP-25](epics.md#ep-25) Customers API                        |
| [HU-11](#hu-11) | View customer information           | [EP-25](epics.md#ep-25) Customers API                        |
| [HU-21](#hu-21) | View active promotions and events   | [EP-26](epics.md#ep-26) Content API                          |
| [HU-13](#hu-13) | Manage promotions and events        | [EP-26](epics.md#ep-26) Content API                          |
| [HU-33](#hu-33) | Manage media content                | [EP-26](epics.md#ep-26) Content API                          |
| [HU-20](#hu-20) | View upcoming doctor visits         | [EP-27](epics.md#ep-27) Doctor visits API                    |
| [HU-14](#hu-14) | Manage doctor visits                | [EP-27](epics.md#ep-27) Doctor visits API                    |
| [HU-25](#hu-25) | Sign in and out as a customer       | [EP-28](epics.md#ep-28) Authentication and authorization API |
| [HU-34](#hu-34) | Sign in and out of the panel        | [EP-28](epics.md#ep-28) Authentication and authorization API |
| [HU-15](#hu-15) | Manage users and permissions        | [EP-28](epics.md#ep-28) Authentication and authorization API |

## EP-21 — Business information API

<a id="hu-01"></a>

### HU-01 (API) — View business information

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Epic      | [EP-21 — Business information API](epics.md#ep-21)        |
| Endpoints | `GET /negocio`                                            |
| Access    | Public                                                    |
| Frontend  | [landing HU-01](../../landing/docs/user-stories.md#hu-01) |

> **As the** landing page, **I want** to get the business information from
> the API, **so that** I can show it without hard-coding it.

```gherkin
Feature: Business information API

  Scenario: Positive – get the business information
    Given the store has its name, description, address, phone, WhatsApp, hours and social media registered
    When GET /negocio is called without authentication
    Then the response is 200 with that data

  Scenario: Positive – the response is cached
    Given GET /negocio was called a moment ago
    When it is called again
    Then the response comes from the cache without querying the database

  Scenario: Negative – optional fields come as null
    Given the store has no Facebook link
    When GET /negocio is called
    Then facebook_url is null in the response

  Scenario: Error – the database does not respond
    Given the database is unavailable and nothing is cached
    When GET /negocio is called
    Then the response is 503

  Scenario: Validation – only GET is public
    When PUT /negocio is called
    Then the response is 404 or 405
```

<a id="hu-32"></a>

### HU-32 (API) — Manage business information

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-21 — Business information API](epics.md#ep-21)    |
| Endpoints | `PUT /admin/negocio`                                  |
| Access    | Administrator                                         |
| Frontend  | [admin HU-32](../../admin/docs/user-stories.md#hu-32) |

> **As the** administration panel, **I want** to update the business
> information through the API, **so that** the change reaches every site.

```gherkin
Feature: Business information management API

  Scenario: Positive – update the information
    Given the administrator is authenticated
    When they call PUT /admin/negocio with new opening hours
    Then the response is 200
    And the GET /negocio cache is invalidated
    And modificado_por and fecha_modificacion are stored

  Scenario: Negative – an employee cannot edit it
    Given an employee is authenticated
    When they call PUT /admin/negocio
    Then the response is 403

  Scenario: Negative – no session
    When PUT /admin/negocio is called without a token
    Then the response is 401

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When the administrator calls PUT /admin/negocio
    Then the response is 503

  Scenario Outline: Validation – business data
    Given the administrator is authenticated
    When they call PUT /admin/negocio with <field> set to "<value>"
    Then the response is <code>

    Examples:
      | field         | value     | code |
      | telefono      | 27711234  | 200  |
      | telefono      | abc       | 400  |
      | whatsapp      |           | 400  |
      | instagram_url | not-a-url | 400  |
```

## EP-22 — Catalog API

<a id="hu-02"></a>

### HU-02 (API) — Browse the product catalog

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                 |
| Endpoints | `GET /productos?page=&limit=`                         |
| Access    | Public                                                |
| Rules     | RN-02                                                 |
| Frontend  | [e-com HU-02](../../e-com/docs/user-stories.md#hu-02) |

> **As the** online store, **I want** to get the paginated list of active
> products with their availability, **so that** I can show the catalog.

```gherkin
Feature: Product catalog API

  Background:
    Given there are 30 active products and 5 inactive ones

  Scenario: Positive – paginated list
    When GET /productos?page=1&limit=20 is called
    Then the response is 200 with 20 active products
    And it includes the total number of products (30) and pages (2)

  Scenario: Negative – inactive products are not returned
    When GET /productos is called without filters
    Then none of the 5 inactive products is in the response

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When GET /productos is called
    Then the response is 503

  Scenario Outline: Validation – pagination parameters
    When GET /productos?page=<page>&limit=<limit> is called
    Then the response is <code>

    Examples:
      | page | limit | code                   |
      | 1    | 20    | 200                    |
      | 50   | 20    | 200 with an empty list |
      | 0    | 20    | 400                    |
      | 1    | 500   | 400                    |
      | abc  | 20    | 400                    |
```

<a id="hu-03"></a>

### HU-03 (API) — Search and filter products

| Field     | Value                                                  |
| --------- | ------------------------------------------------------ |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                  |
| Endpoints | `GET /productos?buscar=&categoria=`, `GET /categorias` |
| Access    | Public                                                 |
| Rules     | RN-02                                                  |
| Frontend  | [e-com HU-03](../../e-com/docs/user-stories.md#hu-03)  |

> **As the** online store, **I want** to search products by text and filter
> them by category, **so that** customers find what they need without loading
> the whole catalog.

```gherkin
Feature: Search and filter API

  Background:
    Given there are active products in the categories "Vitaminas" and "Tés"

  Scenario: Positive – search by text
    When GET /productos?buscar=magnesio is called
    Then the response is 200 with the active products whose name or description contains "magnesio"

  Scenario: Positive – search ignores accents and case
    When GET /productos?buscar=TE is called
    Then the response includes the products that contain "té"

  Scenario: Positive – list categories
    When GET /categorias is called
    Then the response is 200 with the active categories

  Scenario: Negative – no matches
    When GET /productos?buscar=xyz123 is called
    Then the response is 200 with an empty list

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When GET /productos?buscar=vitamina is called
    Then the response is 503

  Scenario Outline: Validation – search parameters
    When GET /productos is called with <parameter>
    Then the response is <code>

    Examples:
      | parameter                                  | code                       |
      | an empty buscar                            | 200 with the whole catalog |
      | a buscar longer than 100 characters        | 400                        |
      | a categoria with an id that does not exist | 200 with an empty list     |
      | a categoria that is not an id              | 400                        |
```

<a id="hu-04"></a>

### HU-04 (API) — View product details

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                 |
| Endpoints | `GET /productos/:id`                                  |
| Access    | Public                                                |
| Rules     | RN-02                                                 |
| Frontend  | [e-com HU-04](../../e-com/docs/user-stories.md#hu-04) |

> **As the** online store, **I want** to get a product's full details,
> **so that** I can show its page.

```gherkin
Feature: Product details API

  Scenario: Positive – active product
    Given the active product with id 12 exists
    When GET /productos/12 is called
    Then the response is 200 with name, description, image, price, category and stock

  Scenario: Negative – inactive product
    Given the product with id 13 is inactive
    When GET /productos/13 is called
    Then the response is 404

  Scenario: Negative – product that does not exist
    When GET /productos/99999 is called
    Then the response is 404

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When GET /productos/12 is called
    Then the response is 503

  Scenario: Validation – invalid id
    When GET /productos/abc is called
    Then the response is 400
```

<a id="hu-16"></a>

### HU-16 (API) — View featured products

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                     |
| Endpoints | `GET /productos/destacados`                               |
| Access    | Public                                                    |
| Rules     | RN-02                                                     |
| Frontend  | [landing HU-16](../../landing/docs/user-stories.md#hu-16) |

> **As the** landing page, **I want** to get the featured products, **so
> that** I can show them without the online store's full catalog.

```gherkin
Feature: Featured products API

  Scenario: Positive – get the featured products
    Given there are 4 active products marked as featured
    When GET /productos/destacados is called
    Then the response is 200 with the 4 products with name, image, description and price

  Scenario: Negative – an inactive featured product is not returned
    Given one of the featured products is inactive
    When GET /productos/destacados is called
    Then that product is not in the response

  Scenario: Negative – no featured products
    Given no product is featured
    When GET /productos/destacados is called
    Then the response is 200 with an empty list

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When GET /productos/destacados is called
    Then the response is 503

  Scenario: Validation – the list has a maximum size
    Given 12 products are marked as featured
    When GET /productos/destacados is called
    Then the response has at most 8 products
```

<a id="hu-22"></a>

### HU-22 (API) — See promotions in the catalog

| Field     | Value                                                             |
| --------- | ----------------------------------------------------------------- |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                             |
| Endpoints | `GET /productos`, `GET /productos/:id` (field `precio_promocion`) |
| Access    | Public                                                            |
| Rules     | RN-19, RN-20, RN-21                                               |
| Frontend  | [e-com HU-22](../../e-com/docs/user-stories.md#hu-22)             |

> **As the** online store, **I want** the API to return the promotional price
> already calculated, **so that** every screen shows the same price and the
> order uses it.

```gherkin
Feature: Promotional prices API

  Background:
    Given today is 15/11/2026
    And "Vitamina C 1000 mg" costs 6500 and has a 10 % promotion from 01/11 to 30/11

  Scenario: Positive – the promotional price is returned
    When GET /productos/<id of Vitamina C> is called
    Then the response has precio 6500 and precio_promocion 5850

  Scenario: Positive – the order uses the promotional price
    When the customer places an order with 2 units of "Vitamina C 1000 mg"
    Then the order line stores precio_unitario 5850

  Scenario: Negative – an expired promotion is not applied
    Given the promotion ended on 14/11
    When GET /productos/<id of Vitamina C> is called
    Then precio_promocion is null

  Scenario: Error – a corrupted promotion does not break the catalog
    Given a promotion has an invalid discount stored
    When GET /productos is called
    Then the response is 200 and that product has precio_promocion null
    And the error is logged

  Scenario: Validation – promotions never stack
    Given the product also belongs to a category with a 5 % promotion
    When GET /productos/<id of Vitamina C> is called
    Then only one promotion is applied (the one defined for the product)
```

<a id="hu-08"></a>

### HU-08 (API) — Manage products

| Field     | Value                                                                         |
| --------- | ----------------------------------------------------------------------------- |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                                         |
| Endpoints | `GET /admin/productos`, `POST /admin/productos`, `PATCH /admin/productos/:id` |
| Access    | Administrator (everything); employee (view and edit, except price)            |
| Rules     | RN-01, RN-03, RN-27                                                           |
| Frontend  | [admin HU-08](../../admin/docs/user-stories.md#hu-08)                         |

> **As the** administration panel, **I want** to create, edit and disable
> products through the API, **so that** changes are validated and recorded
> in a single place.

```gherkin
Feature: Product management API

  Scenario: Positive – create a product
    Given the administrator is authenticated
    When they call POST /admin/productos with code "VIT-001", name, description, price 6500, category and image
    Then the response is 201 with the product created as "activo"
    And creado_por and fecha_creacion are stored

  Scenario: Positive – disable a product
    Given the administrator is authenticated
    When they call PATCH /admin/productos/12 with estado "inactivo"
    Then the response is 200
    And the product no longer appears in GET /productos
    But the orders that include it still show it

  Scenario: Negative – employees cannot change the price
    Given an employee is authenticated
    When they call PATCH /admin/productos/12 with price 7000
    Then the response is 403
    And the price does not change

  Scenario: Negative – duplicate code
    Given a product with code "VIT-001" already exists
    When the administrator calls POST /admin/productos with code "VIT-001"
    Then the response is 409

  Scenario: Negative – no session
    When POST /admin/productos is called without a token
    Then the response is 401

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When the administrator calls POST /admin/productos
    Then the response is 503

  Scenario Outline: Validation – product data
    Given the administrator is authenticated
    When they call POST /admin/productos with <field> set to "<value>"
    Then the response is 400 and points to the field "<field>"

    Examples:
      | field       | value |
      | nombre      |       |
      | descripcion |       |
      | precio      | 0     |
      | precio      | -500  |
      | imagen_url  |       |
```

<a id="hu-27"></a>

### HU-27 (API) — Manage categories

| Field     | Value                                                                            |
| --------- | -------------------------------------------------------------------------------- |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                                            |
| Endpoints | `GET /admin/categorias`, `POST /admin/categorias`, `PATCH /admin/categorias/:id` |
| Access    | Administrator                                                                    |
| Frontend  | [admin HU-27](../../admin/docs/user-stories.md#hu-27)                            |

> **As the** administration panel, **I want** to manage categories through the
> API, **so that** the store's filters stay consistent.

```gherkin
Feature: Category management API

  Scenario: Positive – create a category
    Given the administrator is authenticated
    When they call POST /admin/categorias with nombre "Superalimentos"
    Then the response is 201
    And the category appears in GET /categorias

  Scenario: Negative – disable a category with active products
    Given the category "Vitaminas" has 12 active products
    When the administrator calls PATCH /admin/categorias/<id> with estado "inactivo"
    Then the response is 409 and says how many active products it has

  Scenario: Negative – an employee cannot manage categories
    Given an employee is authenticated
    When they call POST /admin/categorias
    Then the response is 403

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When the administrator calls POST /admin/categorias
    Then the response is 503

  Scenario Outline: Validation – category name
    Given the administrator is authenticated
    When they call POST /admin/categorias with nombre "<name>"
    Then the response is <code>

    Examples:
      | name           | code |
      | Superalimentos | 201  |
      |                | 400  |
      | vitaminas      | 409  |
```

<a id="hu-28"></a>

### HU-28 (API) — Manage product images

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-22 — Catalog API](epics.md#ep-22)                 |
| Endpoints | `POST /admin/productos/:id/imagen`                    |
| Access    | Administrator or authorized staff                     |
| Rules     | RN-03                                                 |
| Frontend  | [admin HU-28](../../admin/docs/user-stories.md#hu-28) |

> **As the** administration panel, **I want** to upload a product image
> through the API, **so that** it is stored safely in Supabase Storage and
> linked to the product.

```gherkin
Feature: Product image API

  Scenario: Positive – upload a new image
    Given the administrator is authenticated
    When they call POST /admin/productos/12/imagen with a JPG of 800 KB
    Then the response is 200 with the new imagen_url
    And the previous image is removed from Storage

  Scenario: Negative – product that does not exist
    Given the administrator is authenticated
    When they call POST /admin/productos/99999/imagen
    Then the response is 404

  Scenario: Negative – no permission
    Given an employee without product permission is authenticated
    When they call POST /admin/productos/12/imagen
    Then the response is 403

  Scenario: Error – Storage does not respond
    Given Supabase Storage is unavailable
    When the administrator uploads an image
    Then the response is 503
    And the product keeps its previous imagen_url

  Scenario Outline: Validation – file
    When the administrator uploads a <file>
    Then the response is <code>

    Examples:
      | file          | code |
      | JPG of 800 KB | 200  |
      | WebP of 1 MB  | 200  |
      | PDF           | 400  |
      | JPG of 8 MB   | 413  |
```

## EP-23 — Inventory API

<a id="hu-09"></a>

### HU-09 (API) — Manage inventory

| Field     | Value                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Epic      | [EP-23 — Inventory API](epics.md#ep-23)                                                                        |
| Endpoints | `GET /admin/inventario`, `POST /admin/inventario/movimientos`, `GET /admin/inventario/:productoId/movimientos` |
| Access    | Administrator, employee                                                                                        |
| Rules     | RN-04, RN-06, RN-27                                                                                            |
| Frontend  | [admin HU-09](../../admin/docs/user-stories.md#hu-09)                                                          |

> **As the** administration panel, **I want** to record inventory movements
> through the API, **so that** stock only changes with a recorded reason and
> responsible user.

```gherkin
Feature: Inventory API

  Background:
    Given "Omega 3" has 10 units
    And an employee is authenticated

  Scenario: Positive – record an entry
    When they call POST /admin/inventario/movimientos with type "entrada", 24 units of "Omega 3" and reason "Pedido al proveedor"
    Then the response is 201
    And "Omega 3" has 34 units
    And the movement stores the employee's usuario_id and the date

  Scenario: Positive – adjustment after a physical count
    When they call POST /admin/inventario/movimientos with type "ajuste", quantity 8 and reason "Conteo físico"
    Then "Omega 3" has 8 units

  Scenario: Negative – exit larger than the stock
    When they call POST /admin/inventario/movimientos with type "salida" and 15 units
    Then the response is 409
    And the stock is still 10

  Scenario: Negative – no session
    When POST /admin/inventario/movimientos is called without a token
    Then the response is 401

  Scenario: Error – two movements at the same time
    Given two employees record an exit of 6 units at the same time
    When the API processes both movements
    Then only one is applied and the other answers 409
    And the stock never becomes negative

  Scenario Outline: Validation – movement body
    When they call POST /admin/inventario/movimientos with type "<type>", quantity "<quantity>" and reason "<reason>"
    Then the response is <code>

    Examples:
      | type    | quantity | reason | code |
      | entrada | 5        | Compra | 201  |
      | entrada | 0        | Compra | 400  |
      | entrada | 5        |        | 400  |
      | entrada | 2.5      | Compra | 400  |
      | regalo  | 5        | Compra | 400  |
```

## EP-24 — Orders API

<a id="hu-06"></a>

### HU-06 (API) — Place an order

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                  |
| Endpoints | `POST /pedidos`                                       |
| Access    | Authenticated customer                                |
| Rules     | RN-05, RN-09, RN-12, RN-24                            |
| Frontend  | [e-com HU-06](../../e-com/docs/user-stories.md#hu-06) |

> **As the** online store, **I want** to place the customer's order through
> the API with prices and stock validated on the server, **so that** the
> staff receives correct orders.

```gherkin
Feature: Order placement API

  Background:
    Given "Omega 3" is active, costs 8000 and has 10 units
    And the customer "Ana Mora" is authenticated

  Scenario: Positive – place the order
    When she calls POST /pedidos with 2 units of "Omega 3"
    Then the response is 201 with the order code, status "pendiente" and estimated total 16000
    And the order line stores precio_unitario 8000
    And the stock of "Omega 3" is still 10

  Scenario: Positive – the server calculates the total
    When she calls POST /pedidos with 2 units of "Omega 3" and a total of 100
    Then the order is placed with an estimated total of 16000

  Scenario: Negative – no session
    When POST /pedidos is called without a token
    Then the response is 401

  Scenario: Negative – not enough stock
    When "Ana Mora" calls POST /pedidos with 11 units of "Omega 3"
    Then the response is 409 and says there are 10 units available

  Scenario: Negative – inactive product
    Given "Té de manzanilla" is inactive
    When "Ana Mora" calls POST /pedidos with "Té de manzanilla"
    Then the response is 409 and points to the unavailable product

  Scenario: Error – the database fails halfway through
    Given the database fails after saving the order and before saving its lines
    When "Ana Mora" calls POST /pedidos
    Then the response is 503
    And no order is left without its lines (the operation is a transaction)

  Scenario Outline: Validation – order body
    When "Ana Mora" calls POST /pedidos with <body>
    Then the response is 400

    Examples:
      | body                            |
      | an empty product list           |
      | a quantity of 0                 |
      | a negative quantity             |
      | a producto_id that is not an id |
      | the same product repeated twice |
```

<a id="hu-23"></a>

### HU-23 (API) — Choose pickup or home delivery

| Field     | Value                                                      |
| --------- | ---------------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                       |
| Endpoints | `GET /zonas-envio`, `POST /pedidos` (field `tipo_entrega`) |
| Access    | Public (zones); authenticated customer (order)             |
| Rules     | RN-29, RN-30, RN-31, RN-32                                 |
| Frontend  | [e-com HU-23](../../e-com/docs/user-stories.md#hu-23)      |

> **As the** online store, **I want** the API to validate the delivery type
> and data of each order, **so that** deliveries only go to covered areas
> with complete data.

```gherkin
Feature: Delivery type API

  Background:
    Given the customer "Ana Mora" is authenticated

  Scenario: Positive – pickup order
    When she calls POST /pedidos with tipo_entrega "retiro"
    Then the response is 201 and costo_envio is 0

  Scenario: Positive – delivery inside the coverage area
    When she calls POST /pedidos with tipo_entrega "domicilio", a covered zone, address and contact
    Then the response is 201 and costo_envio is null until the staff agrees on it

  Scenario: Negative – zone outside the coverage area
    When she calls POST /pedidos with tipo_entrega "domicilio" and a zone that is not covered
    Then the response is 400 and says the zone is not covered

  Scenario: Error – the zones cannot be read
    Given the database is unavailable
    When GET /zonas-envio is called
    Then the response is 503

  Scenario Outline: Validation – delivery data
    When she calls POST /pedidos with tipo_entrega "domicilio" and <data>
    Then the response is 400

    Examples:
      | data                    |
      | no address              |
      | no delivery contact     |
      | an unknown tipo_entrega |
```

<a id="hu-26"></a>

### HU-26 (API) — View my orders

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                  |
| Endpoints | `GET /pedidos/mios`, `GET /pedidos/:codigo`           |
| Access    | Authenticated customer                                |
| Rules     | RN-26                                                 |
| Frontend  | [e-com HU-26](../../e-com/docs/user-stories.md#hu-26) |

> **As the** online store, **I want** to get only the signed-in customer's
> orders, **so that** nobody sees someone else's orders.

```gherkin
Feature: My orders API

  Background:
    Given "Ana Mora" has 3 orders and another customer has 5

  Scenario: Positive – list my orders
    Given "Ana Mora" is authenticated
    When she calls GET /pedidos/mios
    Then the response is 200 with her 3 orders, the most recent first

  Scenario: Negative – another customer's order
    Given "Ana Mora" is authenticated
    When she calls GET /pedidos/<code of another customer's order>
    Then the response is 404

  Scenario: Negative – no session
    When GET /pedidos/mios is called without a token
    Then the response is 401

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When "Ana Mora" calls GET /pedidos/mios
    Then the response is 503

  Scenario: Validation – invalid order code
    Given "Ana Mora" is authenticated
    When she calls GET /pedidos/abc!
    Then the response is 400
```

<a id="hu-10"></a>

### HU-10 (API) — Update an order's status

| Field     | Value                                                       |
| --------- | ----------------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                        |
| Endpoints | `GET /admin/pedidos/:id`, `PATCH /admin/pedidos/:id/estado` |
| Access    | Administrator, employee                                     |
| Rules     | RN-16                                                       |
| Frontend  | [admin HU-10](../../admin/docs/user-stories.md#hu-10)       |

> **As the** administration panel, **I want** to change an order's status
> through the API, **so that** only valid transitions are allowed and every
> change records who made it.

```gherkin
Feature: Order status API

  Background:
    Given the order "N360-0042" exists in status "pendiente"
    And an employee is authenticated

  Scenario: Positive – change the status
    When they call PATCH /admin/pedidos/N360-0042/estado with "en_revision" and the note "Coordinando"
    Then the response is 200
    And a row is added to estados_pedido with the status, note, usuario_id and date

  Scenario: Negative – invalid transition
    Given the order is "entregado"
    When they call PATCH /admin/pedidos/N360-0042/estado with "pendiente"
    Then the response is 409

  Scenario: Negative – an unpaid order cannot be prepared
    Given the order is "en_revision"
    When they call PATCH /admin/pedidos/N360-0042/estado with "preparado"
    Then the response is 409 and says the payment must be confirmed first

  Scenario: Negative – customers cannot change statuses
    Given the customer who owns the order is authenticated
    When she calls PATCH /admin/pedidos/N360-0042/estado
    Then the response is 403

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When the employee calls PATCH /admin/pedidos/N360-0042/estado
    Then the response is 503
    And the status and its history are not left inconsistent

  Scenario Outline: Validation – allowed statuses
    Given the order is in "<current>"
    When the employee changes it to "<new>"
    Then the response is <code>

    Examples:
      | current    | new         | code |
      | pendiente  | en_revision | 200  |
      | confirmado | preparado   | 200  |
      | preparado  | entregado   | 200  |
      | pendiente  | entregado   | 409  |
      | pendiente  | enviado     | 400  |
```

<a id="hu-12"></a>

### HU-12 (API) — View order history

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                  |
| Endpoints | `GET /admin/pedidos?estado=&desde=&hasta=&cliente=`   |
| Access    | Administrator, employee, owner with permissions       |
| Rules     | RN-09                                                 |
| Frontend  | [admin HU-12](../../admin/docs/user-stories.md#hu-12) |

> **As the** administration panel, **I want** to query the order history with
> filters, **so that** the business can be reviewed without downloading every
> order.

```gherkin
Feature: Order history API

  Background:
    Given there are orders from October and November in different statuses
    And an administrator is authenticated

  Scenario: Positive – filter by status and dates
    When they call GET /admin/pedidos?estado=entregado&desde=2026-10-01&hasta=2026-10-31
    Then the response is 200 with the orders delivered in October, paginated

  Scenario: Positive – the historical price is kept
    Given an October order stored "Omega 3" at 8000 and today it costs 9000
    When they look up that order
    Then the order line shows 8000

  Scenario: Negative – there is no endpoint to delete orders
    When they call DELETE /admin/pedidos/N360-0010
    Then the response is 404 or 405
    And the order still exists

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When they call GET /admin/pedidos
    Then the response is 503

  Scenario Outline: Validation – filters
    When they call GET /admin/pedidos with <filter>
    Then the response is <code>

    Examples:
      | filter                            | code |
      | desde=2026-10-01&hasta=2026-10-31 | 200  |
      | desde=2026-10-31&hasta=2026-10-01 | 400  |
      | desde=2026-13-01                  | 400  |
      | estado=enviado                    | 400  |
```

<a id="hu-29"></a>

### HU-29 (API) — Confirm an order's payment

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                  |
| Endpoints | `POST /admin/pedidos/:id/pago`                        |
| Access    | Administrator or employee with payment permission     |
| Rules     | RN-14, RN-15, RN-16, RN-17                            |
| Frontend  | [admin HU-29](../../admin/docs/user-stories.md#hu-29) |

> **As the** administration panel, **I want** the API to record a payment
> only when the received amount matches the total, **so that** no order is
> marked as paid by mistake.

```gherkin
Feature: Payment confirmation API

  Background:
    Given the order "N360-0042" is "en_revision" with a total of 16000
    And an employee with payment permission is authenticated

  Scenario: Positive – confirm the payment
    When they call POST /admin/pedidos/N360-0042/pago with monto 16000 and referencia "SINPE 12345"
    Then the response is 200
    And the order becomes "confirmado"
    And the payment stores the amount, reference, usuario_id and date

  Scenario: Negative – amount does not match
    When they call POST /admin/pedidos/N360-0042/pago with monto 10000
    Then the response is 409 and says the amount does not match the total

  Scenario: Negative – no payment permission
    Given an employee without payment permission is authenticated
    When they call POST /admin/pedidos/N360-0042/pago
    Then the response is 403

  Scenario: Negative – order already paid
    Given the order is already "confirmado"
    When they call POST /admin/pedidos/N360-0042/pago
    Then the response is 409

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When they call POST /admin/pedidos/N360-0042/pago
    Then the response is 503
    And the order is not left as paid

  Scenario Outline: Validation – payment body
    When they call POST /admin/pedidos/N360-0042/pago with <body>
    Then the response is 400

    Examples:
      | body                |
      | no monto            |
      | a monto of 0        |
      | a negative monto    |
```

<a id="hu-30"></a>

### HU-30 (API) — Cancel an order and review a refund

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                  |
| Endpoints | `POST /admin/pedidos/:id/cancelar`                    |
| Access    | Administrator or authorized employee                  |
| Rules     | RN-33                                                 |
| Frontend  | [admin HU-30](../../admin/docs/user-stories.md#hu-30) |

> **As the** administration panel, **I want** the API to require a refund
> note when a paid order is cancelled, **so that** every refund is
> accounted for.

```gherkin
Feature: Order cancellation API

  Background:
    Given the administrator is authenticated

  Scenario: Positive – cancel an unpaid order
    Given the order "N360-0043" is "pendiente"
    When they call POST /admin/pedidos/N360-0043/cancelar with the note "El cliente desistió"
    Then the response is 200 and the order is "cancelado"

  Scenario: Positive – cancel a paid order with a refund note
    Given the order "N360-0042" is "confirmado"
    When they call POST /admin/pedidos/N360-0042/cancelar with nota_reembolso "Reembolso por SINPE 98765"
    Then the response is 200 and the refund note is stored in the history

  Scenario: Negative – paid order without a refund note
    Given the order "N360-0042" is "confirmado"
    When they call POST /admin/pedidos/N360-0042/cancelar without nota_reembolso
    Then the response is 400 and says a refund note is required

  Scenario: Negative – delivered order
    Given the order "N360-0040" is "entregado"
    When they call POST /admin/pedidos/N360-0040/cancelar
    Then the response is 409

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When they call POST /admin/pedidos/N360-0043/cancelar
    Then the response is 503

  Scenario: Validation – note length
    When they call POST /admin/pedidos/N360-0043/cancelar with a note longer than 500 characters
    Then the response is 400
```

<a id="hu-31"></a>

### HU-31 (API) — Apply a manual discount to an order

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-24 — Orders API](epics.md#ep-24)                  |
| Endpoints | `POST /admin/pedidos/:id/descuento`                   |
| Access    | Administrator only                                    |
| Rules     | RN-23, RN-27                                          |
| Frontend  | [admin HU-31](../../admin/docs/user-stories.md#hu-31) |

> **As the** administration panel, **I want** the API to allow manual
> discounts only to the administrator, **so that** prices cannot be changed
> by anyone else.

```gherkin
Feature: Manual discount API

  Background:
    Given the order "N360-0042" is "en_revision" with a total of 16000

  Scenario: Positive – apply a discount
    Given the administrator is authenticated
    When they call POST /admin/pedidos/N360-0042/descuento with monto 1000 and motivo "Cliente frecuente"
    Then the response is 200 and the total becomes 15000
    And the discount stores the reason, usuario_id and date

  Scenario: Negative – employees cannot apply discounts
    Given an employee is authenticated
    When they call POST /admin/pedidos/N360-0042/descuento
    Then the response is 403

  Scenario: Negative – confirmed order
    Given the order is "confirmado"
    When the administrator calls POST /admin/pedidos/N360-0042/descuento
    Then the response is 409

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When the administrator applies the discount
    Then the response is 503 and the total does not change

  Scenario Outline: Validation – discount body
    Given the administrator is authenticated
    When they call POST /admin/pedidos/N360-0042/descuento with monto <amount> and motivo "<reason>"
    Then the response is <code>

    Examples:
      | amount | reason            | code |
      | 1000   | Cliente frecuente | 200  |
      | 0      | Cliente frecuente | 400  |
      | 20000  | Cliente frecuente | 400  |
      | 1000   |                   | 400  |
```

## EP-25 — Customers API

<a id="hu-24"></a>

### HU-24 (API) — Sign up as a customer

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-25 — Customers API](epics.md#ep-25)               |
| Endpoints | `POST /clientes/registro`                             |
| Access    | User authenticated in Supabase without a profile yet  |
| Rules     | RN-24                                                 |
| Frontend  | [e-com HU-24](../../e-com/docs/user-stories.md#hu-24) |

> **As the** online store, **I want** to create the customer profile right
> after the Supabase sign-up, **so that** the customer can place orders.

```gherkin
Feature: Customer sign-up API

  Scenario: Positive – create the profile
    Given "ana@correo.com" just signed up in Supabase Auth
    When she calls POST /clientes/registro with nombre "Ana Mora" and telefono "88887777"
    Then the response is 201
    And a row is created in clientes linked to her auth_id

  Scenario: Negative – the profile already exists
    Given "ana@correo.com" already has a customer profile
    When she calls POST /clientes/registro again
    Then the response is 409

  Scenario: Negative – no session
    When POST /clientes/registro is called without a token
    Then the response is 401

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When she calls POST /clientes/registro
    Then the response is 503

  Scenario Outline: Validation – profile data
    When she calls POST /clientes/registro with <field> set to "<value>"
    Then the response is 400

    Examples:
      | field    | value |
      | nombre   |       |
      | telefono | 1234  |
      | telefono | abcd  |
```

<a id="hu-11"></a>

### HU-11 (API) — View customer information

| Field     | Value                                                    |
| --------- | -------------------------------------------------------- |
| Epic      | [EP-25 — Customers API](epics.md#ep-25)                  |
| Endpoints | `GET /admin/clientes?buscar=`, `GET /admin/clientes/:id` |
| Access    | Administrator, employee                                  |
| Rules     | RN-26                                                    |
| Frontend  | [admin HU-11](../../admin/docs/user-stories.md#hu-11)    |

> **As the** administration panel, **I want** to look up customers and their
> orders in the API, **so that** the staff can serve them with their
> information at hand.

```gherkin
Feature: Customers API

  Background:
    Given the customer "Ana Mora" has 3 orders

  Scenario: Positive – find and view a customer
    Given an employee is authenticated
    When they call GET /admin/clientes?buscar=ana
    And then GET /admin/clientes/<Ana Mora's id>
    Then they get her contact data and her 3 orders

  Scenario: Negative – a customer cannot see other customers
    Given another customer is authenticated
    When they call GET /admin/clientes/<Ana Mora's id>
    Then the response is 403

  Scenario: Negative – customer that does not exist
    Given an employee is authenticated
    When they call GET /admin/clientes/99999
    Then the response is 404

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When an employee calls GET /admin/clientes
    Then the response is 503

  Scenario Outline: Validation – search
    Given an employee is authenticated
    When they call GET /admin/clientes?buscar=<value>
    Then the response is <code>

    Examples:
      | value                 | code                    |
      | ana                   | 200 with "Ana Mora"     |
      | 88887777              | 200 with "Ana Mora"     |
      | (empty)               | 200 with the paged list |
      | (over 100 characters) | 400                     |
```

## EP-26 — Content API

<a id="hu-21"></a>

### HU-21 (API) — View active promotions and events

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Epic      | [EP-26 — Content API](epics.md#ep-26)                     |
| Endpoints | `GET /promociones`, `GET /eventos`, `GET /contenidos`     |
| Access    | Public                                                    |
| Rules     | RN-19, RN-40, RN-42                                       |
| Frontend  | [landing HU-21](../../landing/docs/user-stories.md#hu-21) |

> **As the** landing page and the online store, **I want** to get only the
> content that is valid today, **so that** nobody has to remove it by hand.

```gherkin
Feature: Public content API

  Background:
    Given today is 15/11/2026

  Scenario: Positive – active promotion
    Given an active promotion exists from 01/11 to 30/11
    When GET /promociones is called without authentication
    Then the response includes that promotion

  Scenario: Negative – expired promotion
    Given an active promotion exists from 01/10 to 31/10
    When GET /promociones is called
    Then that promotion is not in the response

  Scenario: Negative – unpublished event
    Given an event was disabled
    When GET /eventos is called
    Then that event is not in the response

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When GET /promociones is called
    Then the response is 503

  Scenario: Validation – future content is not returned yet
    Given a promotion starts on 01/12
    When GET /promociones is called on 15/11
    Then that promotion is not in the response
```

<a id="hu-13"></a>

### HU-13 (API) — Manage promotions and events

| Field     | Value                                                                |
| --------- | -------------------------------------------------------------------- |
| Epic      | [EP-26 — Content API](epics.md#ep-26)                                |
| Endpoints | `GET/POST/PATCH /admin/promociones`, `GET/POST/PATCH /admin/eventos` |
| Access    | Administrator or authorized staff                                    |
| Rules     | RN-20, RN-21, RN-37, RN-38                                           |
| Frontend  | [admin HU-13](../../admin/docs/user-stories.md#hu-13)                |

> **As the** administration panel, **I want** to create and withdraw
> promotions and events in the API, **so that** their rules are enforced in
> a single place.

```gherkin
Feature: Promotions and events management API

  Scenario: Positive – create a promotion
    Given the administrator is authenticated
    When they call POST /admin/promociones for "Vitamina C 1000 mg" with 10 % from 01/11 to 30/11
    Then the response is 201

  Scenario: Positive – create an in-person event
    Given the administrator is authenticated
    When they call POST /admin/eventos with name, date, time and location
    Then the response is 201

  Scenario: Negative – two promotions on the same product
    Given "Vitamina C 1000 mg" has a promotion from 01/11 to 30/11
    When the administrator calls POST /admin/promociones for that product from 15/11 to 20/11
    Then the response is 409

  Scenario: Negative – an employee without permission
    Given an employee without content permission is authenticated
    When they call POST /admin/promociones
    Then the response is 403

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When the administrator calls POST /admin/eventos
    Then the response is 503

  Scenario Outline: Validation – dates and data
    Given the administrator is authenticated
    When they call POST on <resource> with <data>
    Then the response is 400

    Examples:
      | resource           | data                                 |
      | /admin/promociones | fecha_fin before fecha_inicio        |
      | /admin/promociones | descuento 0                          |
      | /admin/promociones | descuento over 100                   |
      | /admin/eventos     | an in-person event without ubicacion |
```

<a id="hu-33"></a>

### HU-33 (API) — Manage media content

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-26 — Content API](epics.md#ep-26)                 |
| Endpoints | `GET/POST/PATCH /admin/contenidos`                    |
| Access    | Administrator or authorized staff                     |
| Rules     | RN-39, RN-41, RN-42                                   |
| Frontend  | [admin HU-33](../../admin/docs/user-stories.md#hu-33) |

> **As the** administration panel, **I want** to publish and withdraw images
> and videos through the API, **so that** only authorized staff changes what
> the public sees.

```gherkin
Feature: Media content API

  Scenario: Positive – publish content with a period
    Given the administrator is authenticated
    When they call POST /admin/contenidos with title, video link, fecha_inicio 01/11 and fecha_fin 30/11
    Then the response is 201

  Scenario: Positive – withdraw content
    Given a content item is published
    When the administrator calls PATCH /admin/contenidos/<id> with estado "retirado"
    Then it no longer appears in GET /contenidos

  Scenario: Negative – no permission
    Given an employee without content permission is authenticated
    When they call POST /admin/contenidos
    Then the response is 403

  Scenario: Error – Storage does not respond
    Given Supabase Storage is unavailable
    When the administrator publishes content with an image
    Then the response is 503

  Scenario Outline: Validation – content data
    Given the administrator is authenticated
    When they call POST /admin/contenidos with <data>
    Then the response is 400

    Examples:
      | data                          |
      | an empty titulo               |
      | fecha_fin before fecha_inicio |
      | a video_url that is not a URL |
```

## EP-27 — Doctor visits API

<a id="hu-20"></a>

### HU-20 (API) — View upcoming doctor visits

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Epic      | [EP-27 — Doctor visits API](epics.md#ep-27)               |
| Endpoints | `GET /visitas-doctor`                                     |
| Access    | Public                                                    |
| Rules     | RN-35, RN-36                                              |
| Frontend  | [landing HU-20](../../landing/docs/user-stories.md#hu-20) |

> **As the** landing page, **I want** to get only the confirmed upcoming
> visits, **so that** customers never see a visit that will not happen.

```gherkin
Feature: Public doctor visits API

  Background:
    Given today is 15/11/2026

  Scenario: Positive – confirmed upcoming visits
    Given a confirmed visit exists on 22/11
    When GET /visitas-doctor is called without authentication
    Then the response includes that visit with doctor, specialty, date and times

  Scenario: Negative – pending or cancelled visits
    Given a pending visit and a cancelled visit exist
    When GET /visitas-doctor is called
    Then neither of them is in the response

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When GET /visitas-doctor is called
    Then the response is 503

  Scenario: Validation – past visits are not returned
    Given a confirmed visit happened on 10/11
    When GET /visitas-doctor is called on 15/11
    Then that visit is not in the response
```

<a id="hu-14"></a>

### HU-14 (API) — Manage doctor visits

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Epic      | [EP-27 — Doctor visits API](epics.md#ep-27)           |
| Endpoints | `GET/POST/PATCH /admin/visitas-doctor`                |
| Access    | Administrator or authorized staff                     |
| Rules     | RN-34, RN-35, RN-36                                   |
| Frontend  | [admin HU-14](../../admin/docs/user-stories.md#hu-14) |

> **As the** administration panel, **I want** to manage doctor visits in the
> API, **so that** their dates and statuses follow the business rules.

```gherkin
Feature: Doctor visits management API

  Scenario: Positive – create a confirmed visit
    Given the administrator is authenticated
    When they call POST /admin/visitas-doctor with doctor, specialty, date 22/11, from 09:00 to 12:00 and status "confirmada"
    Then the response is 201
    And the visit appears in GET /visitas-doctor

  Scenario: Negative – a cancelled visit is no longer published
    Given a confirmed visit exists
    When the administrator calls PATCH /admin/visitas-doctor/<id> with status "cancelada"
    Then the visit no longer appears in GET /visitas-doctor

  Scenario: Negative – no session
    When POST /admin/visitas-doctor is called without a token
    Then the response is 401

  Scenario: Error – the database does not respond
    Given the database is unavailable
    When the administrator calls POST /admin/visitas-doctor
    Then the response is 503

  Scenario Outline: Validation – time range
    Given the administrator is authenticated
    When they call POST /admin/visitas-doctor with hora_inicio "<start>" and hora_fin "<end>"
    Then the response is <code>

    Examples:
      | start | end   | code |
      | 09:00 | 12:00 | 201  |
      | 12:00 | 09:00 | 400  |
      | 09:00 | 09:00 | 400  |
      | 25:00 | 26:00 | 400  |
```

## EP-28 — Authentication and authorization API

<a id="hu-25"></a>

### HU-25 (API) — Sign in and out as a customer

| Field     | Value                                                          |
| --------- | -------------------------------------------------------------- |
| Epic      | [EP-28 — Authentication and authorization API](epics.md#ep-28) |
| Endpoints | `GET /clientes/yo`                                             |
| Access    | Authenticated customer                                         |
| Frontend  | [e-com HU-25](../../e-com/docs/user-stories.md#hu-25)          |

> **As the** online store, **I want** the API to recognize the signed-in
> customer from their Supabase token, **so that** every customer request is
> tied to the right person.

```gherkin
Feature: Customer session API

  Scenario: Positive – get the signed-in customer
    Given "Ana Mora" signed in with Supabase Auth
    When she calls GET /clientes/yo with her token
    Then the response is 200 with her name, email and phone

  Scenario: Negative – a staff account is not a customer
    Given María is an employee without a customer profile
    When she calls GET /clientes/yo
    Then the response is 404

  Scenario: Negative – expired or tampered token
    When GET /clientes/yo is called with an expired token or a tampered signature
    Then the response is 401

  Scenario: Error – the token cannot be verified
    Given the Supabase JWKS cannot be downloaded and there is no cached copy
    When GET /clientes/yo is called
    Then the response is 503
    And the request is not treated as authenticated

  Scenario: Validation – malformed header
    When GET /clientes/yo is called with the header "Authorization: abc"
    Then the response is 401
```

<a id="hu-34"></a>

### HU-34 (API) — Sign in and out of the panel

| Field     | Value                                                          |
| --------- | -------------------------------------------------------------- |
| Epic      | [EP-28 — Authentication and authorization API](epics.md#ep-28) |
| Endpoints | `GET /admin/yo`                                                |
| Access    | Any internal user                                              |
| Frontend  | [admin HU-34](../../admin/docs/user-stories.md#hu-34)          |

> **As the** administration panel, **I want** to know who is signed in and
> what role they have, **so that** I show only what they can use.

```gherkin
Feature: Staff session API

  Scenario: Positive – get the current user and role
    Given María is authenticated with the role "empleado"
    When she calls GET /admin/yo
    Then the response is 200 with her name and the role "empleado"

  Scenario: Negative – disabled user
    Given María's account is disabled
    When María calls GET /admin/yo with a valid token
    Then the response is 403

  Scenario: Negative – a customer account
    Given "Ana Mora" is only a customer
    When she calls GET /admin/yo
    Then the response is 403

  Scenario: Error – the token cannot be verified
    Given the Supabase JWKS cannot be downloaded and there is no cached copy
    When GET /admin/yo is called
    Then the response is 503
    And the request is not treated as authenticated

  Scenario: Validation – expired token
    When GET /admin/yo is called with an expired token
    Then the response is 401
```

<a id="hu-15"></a>

### HU-15 (API) — Manage users and permissions

| Field     | Value                                                          |
| --------- | -------------------------------------------------------------- |
| Epic      | [EP-28 — Authentication and authorization API](epics.md#ep-28) |
| Endpoints | `GET/POST/PATCH /admin/usuarios`                               |
| Access    | Administrator only                                             |
| Rules     | RN-27, RN-28                                                   |
| Frontend  | [admin HU-15](../../admin/docs/user-stories.md#hu-15)          |

> **As the** administrator, **I want** the API to manage internal accounts
> and their roles, **so that** nobody does more than their role allows.

```gherkin
Feature: Users and permissions API

  Scenario: Positive – create an internal user
    Given the administrator is authenticated
    When they call POST /admin/usuarios with name, email "maria@nativa360.com" and role "empleado"
    Then the response is 201
    And the account is created in Supabase Auth without storing passwords in the API database

  Scenario: Negative – an employee cannot manage users
    Given María is authenticated with the role "empleado"
    When she calls POST /admin/usuarios
    Then the response is 403

  Scenario: Negative – the system cannot be left without an administrator
    Given there is only one user with the role "administrador"
    When they call PATCH /admin/usuarios/<their id> with the role "empleado"
    Then the response is 409

  Scenario: Error – Supabase Auth does not respond
    Given Supabase Auth is unavailable
    When the administrator calls POST /admin/usuarios
    Then the response is 503
    And no half-created user is left in the database

  Scenario Outline: Validation – user data
    Given the administrator is authenticated
    When they call POST /admin/usuarios with email "<email>" and role "<role>"
    Then the response is <code>

    Examples:
      | email               | role         | code |
      | pedro@nativa360.com | empleado     | 201  |
      | maria@nativa360.com | empleado     | 409  |
      | pedro@              | empleado     | 400  |
      | pedro@nativa360.com | superusuario | 400  |
```
