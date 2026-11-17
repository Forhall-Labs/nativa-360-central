# Epics — Landing page

Epics in Connextra format, organized by functional module (SRS 4.3 and
functional requirements MO-01 to MO-06). Each epic lists its user stories,
which are detailed in [`user-stories.md`](user-stories.md).

Stories HU-01 to HU-15 come from the SRS (section 3.7). Stories from HU-16 on
are **derived from the SRS**: they cover SRS requirements or business rules
that had no story of their own, and must be added to the SRS backlog.

| Epic            | Name                     | Stories      |
| --------------- | ------------------------ | ------------ |
| [EP-01](#ep-01) | Business presentation    | HU-01        |
| [EP-02](#ep-02) | Featured products        | HU-16        |
| [EP-03](#ep-03) | Contact and social media | HU-17, HU-18 |
| [EP-04](#ep-04) | Navigation to the store  | HU-19        |
| [EP-05](#ep-05) | Doctor visits and news   | HU-20, HU-21 |

<a id="ep-01"></a>

## EP-01 — Business presentation

> **As a** site visitor, **I want** to know what Nativa 360 is, what it sells
> and where it is, **so that** I can decide whether to visit it or buy from
> it.

| Story                          | Name                      | Priority | Sprint           | Source |
| ------------------------------ | ------------------------- | -------- | ---------------- | ------ |
| [HU-01](user-stories.md#hu-01) | View business information | High     | 2 · Landing page | SRS    |

**Requirements:** MO-01 · RNF-02, RNF-03, RNF-05.

<a id="ep-02"></a>

## EP-02 — Featured products

> **As a** site visitor, **I want** to see a selection of the store's
> products on the landing page, **so that** I get an idea of what it offers
> before entering the online store.

| Story                          | Name                   | Priority | Sprint           | Source          |
| ------------------------------ | ---------------------- | -------- | ---------------- | --------------- |
| [HU-16](user-stories.md#hu-16) | View featured products | High     | 2 · Landing page | Derived (MO-03) |

**Requirements:** MO-03 · RN-02 · RNF-02.

<a id="ep-03"></a>

## EP-03 — Contact and social media

> **As a** site visitor, **I want** to reach the store through WhatsApp and
> its social media from the website, **so that** I can ask questions and
> follow its news.

| Story                          | Name                           | Priority | Sprint           | Source          |
| ------------------------------ | ------------------------------ | -------- | ---------------- | --------------- |
| [HU-17](user-stories.md#hu-17) | Contact the store on WhatsApp  | High     | 2 · Landing page | Derived (MO-04) |
| [HU-18](user-stories.md#hu-18) | Visit the store's social media | Medium   | 2 · Landing page | Derived (MO-02) |

**Requirements:** MO-02, MO-04 · RNF-10.

**Out of scope:** automatic WhatsApp messages or chatbots.

<a id="ep-04"></a>

## EP-04 — Navigation to the store

> **As a** site visitor, **I want** a clear way to go from the landing page to
> the online store, **so that** I can start shopping without searching for
> it.

| Story                          | Name                   | Priority | Sprint           | Source          |
| ------------------------------ | ---------------------- | -------- | ---------------- | --------------- |
| [HU-19](user-stories.md#hu-19) | Go to the online store | High     | 2 · Landing page | Derived (MO-05) |

**Requirements:** MO-05 · RNF-05.

<a id="ep-05"></a>

## EP-05 — Doctor visits and news

> **As a** site visitor, **I want** to see the upcoming doctor visits and the
> store's current promotions and events, **so that** I can plan a visit and
> take advantage of them.

| Story                          | Name                              | Priority | Sprint                    | Source                 |
| ------------------------------ | --------------------------------- | -------- | ------------------------- | ---------------------- |
| [HU-20](user-stories.md#hu-20) | View upcoming doctor visits       | Medium   | 6 · Customers and content | Derived (MO-06)        |
| [HU-21](user-stories.md#hu-21) | View active promotions and events | Medium   | 6 · Customers and content | Derived (RN-19, RN-40) |

The content shown here is managed in the admin panel (HU-13 and HU-14 in
[`../../admin/docs/user-stories.md`](../../admin/docs/user-stories.md)).

**Requirements:** MO-06 · RN-19, RN-35, RN-36, RN-40, RN-42.
