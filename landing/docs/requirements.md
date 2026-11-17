# Requirements — Landing page

Source: Nativa 360 SRS, sections 3.8.4.1 (functional requirements), 3.8.5
(business rules) and 3.8.7 (non-functional requirements).

## Purpose

The landing page is the site's entry point: it introduces Nativa 360, its
contact channels and some featured products, and sends visitors to the
online store or to the store's WhatsApp.

## Users

| Role     | What they do on the landing page                      |
| -------- | ----------------------------------------------------- |
| Visitor  | Anyone, no account. Reads information and navigates.  |
| Customer | Same as a visitor; enters the online store from here. |

## Functional requirements

| Code  | Requirement               | Description                                                                                         | HU    |
| ----- | ------------------------- | --------------------------------------------------------------------------------------------------- | ----- |
| MO-01 | Show business information | Shows Nativa 360's name, phone, location and contact channels.                                      | HU-01 |
| MO-02 | Link to social media      | Shows links to the official social media accounts (Instagram, Facebook).                            | HU-18 |
| MO-03 | Show featured products    | Shows a selection of featured products with name, image, description and price.                     | HU-16 |
| MO-04 | Open WhatsApp             | A button opens a WhatsApp conversation with the store. Replies are handled manually.                | HU-17 |
| MO-05 | Go to the online store    | A visible button takes the visitor to the online store catalog.                                     | HU-19 |
| MO-06 | Show doctor visits        | Shows confirmed doctor visits: name, specialty, date and time. They are managed in `admin` (HU-14). | HU-20 |

## Business rules

| Code  | Rule                                                                          |
| ----- | ----------------------------------------------------------------------------- |
| RN-02 | Only active products are shown (applies to featured products).                |
| RN-19 | A promotion is only shown during its validity period.                         |
| RN-35 | Only doctor visits with a date and time confirmed by the store are published. |
| RN-36 | A cancelled visit is no longer announced.                                     |
| RN-40 | Content with a publication period is only shown during that period.           |
| RN-42 | Content that is unpublished is no longer shown.                               |

## Non-functional requirements

| Code   | Type          | How it applies to the landing page                                              |
| ------ | ------------- | ------------------------------------------------------------------------------- |
| RNF-02 | Performance   | Loads fast; optimized images, especially on phones and slow connections.        |
| RNF-03 | Availability  | If the API is down, the static business information is still shown.             |
| RNF-05 | Usability     | Simple navigation, no information overload, clear call-to-action buttons.       |
| RNF-06 | Accessibility | Responsive on desktop, tablet and phone; readable colors and text sizes.        |
| RNF-09 | Compatibility | Works on modern browsers.                                                       |
| RNF-10 | Integration   | WhatsApp and social media are external links: no automatic messages or replies. |

## Out of scope

- Sign-up, login or purchases from the landing page (that lives in `e-com`).
- Automatic WhatsApp messages or chatbots.
- Editing content: everything the landing page shows is managed from
  `admin`.

## Open questions

- The SRS uses the code **MO-06** twice (doctor visits on the landing page
  and available products in the online store). One of them should be
  renumbered in the SRS.
- Whether promotions and events (HU-21) are also shown on the landing page or
  only in the online store.
