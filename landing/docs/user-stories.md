# User stories — Landing page

User stories in Connextra format with Gherkin scenarios. Each story belongs
to one epic in [`epics.md`](epics.md) and has at least one positive, one
negative, one error and one validation scenario; each scenario is an
acceptance criterion that needs a test. The API side of each story is in
[`../../backend/docs/user-stories.md`](../../backend/docs/user-stories.md).

Quoted texts inside the scenarios are the exact UI texts, in Spanish, as the
user sees them. Names and products are examples.

| Story           | Name                              | Epic                                             |
| --------------- | --------------------------------- | ------------------------------------------------ |
| [HU-01](#hu-01) | View business information         | [EP-01](epics.md#ep-01) Business presentation    |
| [HU-16](#hu-16) | View featured products            | [EP-02](epics.md#ep-02) Featured products        |
| [HU-17](#hu-17) | Contact the store on WhatsApp     | [EP-03](epics.md#ep-03) Contact and social media |
| [HU-18](#hu-18) | Visit the store's social media    | [EP-03](epics.md#ep-03) Contact and social media |
| [HU-19](#hu-19) | Go to the online store            | [EP-04](epics.md#ep-04) Navigation to the store  |
| [HU-20](#hu-20) | View upcoming doctor visits       | [EP-05](epics.md#ep-05) Doctor visits and news   |
| [HU-21](#hu-21) | View active promotions and events | [EP-05](epics.md#ep-05) Doctor visits and news   |

<a id="hu-01"></a>

## HU-01 — View business information

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-01 — Business presentation](epics.md#ep-01)         |
| Source       | SRS                                                     |
| User         | Customer / visitor                                      |
| Priority     | High                                                    |
| Risk         | Low                                                     |
| Sprint       | 2 · Landing page                                        |
| Points       | TBD                                                     |
| Requirements | MO-01                                                   |
| API          | [HU-01 (API)](../../backend/docs/user-stories.md#hu-01) |

> **As a** customer, **I want** to see Nativa 360's general information on
> the website, **so that** I know what it sells, where it is and how to reach
> it.

```gherkin
Feature: View business information

  Background:
    Given the store has its name, description, address, phone and opening hours registered

  Scenario: Positive – the visitor sees the business information
    Given a visitor opens the landing page
    When the page finishes loading
    Then they see Nativa 360's name and description
    And in the contact section they see the address, phone, opening hours and a map

  Scenario: Positive – the information is updated from the admin panel
    Given the administrator changed the opening hours in the admin panel
    When a visitor opens the landing page after the next revalidation
    Then they see the new opening hours

  Scenario: Negative – a field without data is not shown empty
    Given the store has no opening hours registered
    When a visitor opens the landing page
    Then the opening hours line is not shown
    And no empty label like "Horario:" appears

  Scenario: Error – the API does not respond
    Given the API is unavailable
    When a visitor opens the landing page
    Then the page still loads
    And it shows the fallback phone and address
    And no technical message is shown

  Scenario Outline: Validation – the page adapts to the screen size
    Given a visitor opens the landing page on a <device>
    When they look at the contact section
    Then the map and the contact data are shown <layout>

    Examples:
      | device  | layout                    |
      | phone   | one below the other       |
      | tablet  | one below the other       |
      | desktop | side by side              |
```

<a id="hu-16"></a>

## HU-16 — View featured products

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-02 — Featured products](epics.md#ep-02)             |
| Source       | Derived from SRS (MO-03)                                |
| User         | Customer / visitor                                      |
| Priority     | High                                                    |
| Risk         | Low                                                     |
| Sprint       | 2 · Landing page                                        |
| Points       | TBD                                                     |
| Requirements | MO-03                                                   |
| Rules        | RN-02                                                   |
| API          | [HU-16 (API)](../../backend/docs/user-stories.md#hu-16) |

> **As a** visitor, **I want** to see the store's featured products on the
> landing page, **so that** I know what it offers before entering the online
> store.

```gherkin
Feature: View featured products

  Background:
    Given there are 4 active products marked as featured

  Scenario: Positive – the visitor sees the featured products
    Given a visitor opens the landing page
    When the featured products section loads
    Then they see 4 cards with image, name, short description and price

  Scenario: Positive – a featured product opens in the store
    Given a visitor sees the featured product "Omega 3"
    When they tap its card
    Then the "Omega 3" page opens in the online store

  Scenario: Negative – a disabled featured product is not shown
    Given the product "Té verde orgánico" is featured
    But the staff disabled it
    When a visitor opens the landing page
    Then "Té verde orgánico" does not appear among the featured products

  Scenario: Negative – there are no featured products
    Given no product is marked as featured
    When a visitor opens the landing page
    Then the featured products section is not shown

  Scenario: Error – the featured products cannot be loaded
    Given the API does not respond
    When a visitor opens the landing page
    Then the featured products section is hidden
    And the rest of the page is shown normally

  Scenario Outline: Validation – long descriptions and cards per row
    Given a visitor opens the landing page on a <device>
    When they look at the featured products
    Then <columns> cards are shown per row
    And each description is cut at 2 lines

    Examples:
      | device  | columns |
      | phone   | 1       |
      | tablet  | 2       |
      | desktop | 4       |
```

<a id="hu-17"></a>

## HU-17 — Contact the store on WhatsApp

| Field        | Value                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| Epic         | [EP-03 — Contact and social media](epics.md#ep-03)                                     |
| Source       | Derived from SRS (MO-04)                                                               |
| User         | Customer / visitor                                                                     |
| Priority     | High                                                                                   |
| Risk         | Low                                                                                    |
| Sprint       | 2 · Landing page                                                                       |
| Points       | TBD                                                                                    |
| Requirements | MO-04                                                                                  |
| API          | Reads the WhatsApp number from [HU-01 (API)](../../backend/docs/user-stories.md#hu-01) |

> **As a** visitor, **I want** to open a WhatsApp conversation with the store
> from the landing page, **so that** I can ask about products without saving
> the number.

```gherkin
Feature: Contact the store on WhatsApp

  Background:
    Given the store has its WhatsApp number configured

  Scenario: Positive – open WhatsApp from the landing page
    Given a visitor is on the landing page
    When they press "Escribinos por WhatsApp"
    Then a WhatsApp conversation with the store's number opens in a new tab

  Scenario: Positive – the WhatsApp button is always at hand on phones
    Given a visitor is on the landing page on a phone
    When they scroll down the page
    Then the WhatsApp button stays fixed in a corner

  Scenario: Negative – the system does not answer automatically
    Given a visitor sent a message from the WhatsApp button
    When the store has not answered yet
    Then the visitor receives no automatic reply from the system

  Scenario: Error – the WhatsApp number is not available
    Given the API does not return the WhatsApp number
    When a visitor opens the landing page
    Then the WhatsApp button uses the fallback number

  Scenario: Validation – the number is formatted for WhatsApp
    Given the store's number is registered as "8888-7777"
    When the visitor presses "Escribinos por WhatsApp"
    Then the link opens "https://wa.me/50688887777"
```

<a id="hu-18"></a>

## HU-18 — Visit the store's social media

| Field        | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| Epic         | [EP-03 — Contact and social media](epics.md#ep-03)                           |
| Source       | Derived from SRS (MO-02)                                                     |
| User         | Customer / visitor                                                           |
| Priority     | Medium                                                                       |
| Risk         | Low                                                                          |
| Sprint       | 2 · Landing page                                                             |
| Points       | TBD                                                                          |
| Requirements | MO-02                                                                        |
| API          | Reads the links from [HU-01 (API)](../../backend/docs/user-stories.md#hu-01) |

> **As a** visitor, **I want** to open the store's Instagram and Facebook from
> the website, **so that** I can follow its news and raffles.

```gherkin
Feature: Visit the store's social media

  Background:
    Given the store has its Instagram and Facebook links configured

  Scenario: Positive – open Instagram
    Given a visitor is on the landing page
    When they press the Instagram icon
    Then the store's Instagram profile opens in a new tab

  Scenario: Negative – a social network without a link is not shown
    Given the store has no Facebook link configured
    When a visitor opens the landing page
    Then the Facebook icon is not shown
    And the Instagram icon is shown

  Scenario: Error – the links cannot be loaded
    Given the API does not respond
    When a visitor opens the landing page
    Then the social media icons are hidden
    And the rest of the page is shown normally

  Scenario: Validation – icons have an accessible name
    Given a visitor uses a screen reader
    When they reach the social media icons
    Then the reader announces "Instagram de Nativa 360" and "Facebook de Nativa 360"
```

<a id="hu-19"></a>

## HU-19 — Go to the online store

| Field        | Value                                             |
| ------------ | ------------------------------------------------- |
| Epic         | [EP-04 — Navigation to the store](epics.md#ep-04) |
| Source       | Derived from SRS (MO-05)                          |
| User         | Customer / visitor                                |
| Priority     | High                                              |
| Risk         | Low                                               |
| Sprint       | 2 · Landing page                                  |
| Points       | TBD                                               |
| Requirements | MO-05                                             |
| API          | None (uses `NEXT_PUBLIC_ECOM_URL`)                |

> **As a** visitor, **I want** a visible button to go to the online store,
> **so that** I can start shopping right away.

```gherkin
Feature: Go to the online store

  Scenario: Positive – go to the store from the header
    Given a visitor is on the landing page
    When they press "Ver tienda" in the header
    Then they land on the online store catalog

  Scenario: Positive – the button is visible on every screen size
    Given a visitor opens the landing page on a phone
    When they look at the introduction section
    Then they see the "Ver tienda" button without scrolling

  Scenario: Negative – the store link does not open a new tab
    Given a visitor is on the landing page
    When they press "Ver tienda"
    Then the store opens in the same tab

  Scenario: Error – the online store is down
    Given the online store does not respond
    When a visitor presses "Ver tienda"
    Then the browser shows the online store's error page
    And the visitor can go back to the landing page

  Scenario: Validation – the store URL is configured
    Given the variable NEXT_PUBLIC_ECOM_URL is not set
    When the landing page is built
    Then the build fails with a message saying the variable is missing
```

<a id="hu-20"></a>

## HU-20 — View upcoming doctor visits

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| Epic         | [EP-05 — Doctor visits and news](epics.md#ep-05)        |
| Source       | Derived from SRS (MO-06)                                |
| User         | Customer / visitor                                      |
| Priority     | Medium                                                  |
| Risk         | Low                                                     |
| Sprint       | 6 · Customers and content                               |
| Points       | TBD                                                     |
| Requirements | MO-06                                                   |
| Rules        | RN-35, RN-36                                            |
| API          | [HU-20 (API)](../../backend/docs/user-stories.md#hu-20) |

> **As a** customer, **I want** to see when the doctor will be at the store,
> **so that** I can plan my visit.

```gherkin
Feature: View upcoming doctor visits

  Background:
    Given "Dr. Luis Vargas", specialty "Medicina natural", has a confirmed visit on 22/11 from 09:00 to 12:00

  Scenario: Positive – the visitor sees the upcoming visits
    Given a visitor opens the landing page
    When the doctor visits section loads
    Then they see "Dr. Luis Vargas", "Medicina natural", 22/11 and 09:00 – 12:00

  Scenario: Negative – a pending or cancelled visit is not shown
    Given another visit is pending confirmation and a third one was cancelled
    When a visitor opens the landing page
    Then only the confirmed visit on 22/11 is shown

  Scenario: Negative – there are no upcoming visits
    Given there are no confirmed visits from today on
    When a visitor opens the landing page
    Then the doctor visits section is not shown

  Scenario: Error – the visits cannot be loaded
    Given the API does not respond
    When a visitor opens the landing page
    Then the doctor visits section is hidden
    And the rest of the page is shown normally

  Scenario: Validation – past visits disappear
    Given the visit on 22/11 already happened
    When a visitor opens the landing page on 23/11
    Then that visit is no longer shown
```

<a id="hu-21"></a>

## HU-21 — View active promotions and events

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Epic     | [EP-05 — Doctor visits and news](epics.md#ep-05)        |
| Source   | Derived from SRS (RN-19, RN-40)                         |
| User     | Customer / visitor                                      |
| Priority | Medium                                                  |
| Risk     | Low                                                     |
| Sprint   | 6 · Customers and content                               |
| Points   | TBD                                                     |
| Rules    | RN-19, RN-37, RN-40, RN-42                              |
| API      | [HU-21 (API)](../../backend/docs/user-stories.md#hu-21) |

> **As a** visitor, **I want** to see the store's current promotions and
> upcoming events, **so that** I can take advantage of them.

```gherkin
Feature: View active promotions and events

  Background:
    Given today is 15/11/2026
    And the promotion "10 % en Vitamina C" is active from 01/11 to 30/11
    And the event "Charla de alimentación consciente" is published for 20/11

  Scenario: Positive – the visitor sees promotions and events
    Given a visitor opens the landing page
    When the news section loads
    Then they see "10 % en Vitamina C" with "Hasta el 30 de noviembre"
    And they see "Charla de alimentación consciente" with its date, time and location

  Scenario: Negative – expired or unpublished content is not shown
    Given a promotion ended on 31/10 and an event was unpublished
    When a visitor opens the landing page
    Then neither of them is shown

  Scenario: Negative – there is nothing active
    Given there are no active promotions or upcoming events
    When a visitor opens the landing page
    Then the news section is not shown

  Scenario: Error – the content cannot be loaded
    Given the API does not respond
    When a visitor opens the landing page
    Then the news section is hidden
    And the rest of the page is shown normally

  Scenario: Validation – a promotion that starts in the future is not shown yet
    Given a promotion starts on 01/12
    When a visitor opens the landing page on 15/11
    Then that promotion is not shown
```
