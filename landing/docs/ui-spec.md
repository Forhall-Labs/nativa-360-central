# UI spec — Landing page

Source: Nativa 360 SRS, sections 2.2.4 (interface standards), 3.8.2.6
(design constraints), 3.8.3.1 (user interfaces) and 3.8.7.4 (usability and
accessibility).

## Visual identity

Shared by `landing`, `e-com` and `admin`: customers must feel it is the same
store in all three.

| Element    | Guideline                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------- |
| Colors     | **Blue** as the main color, **white** background and **green** only as a light accent.        |
| Typography | One sans-serif family for the whole site; hierarchy through size and weight, not other fonts. |
| Buttons    | Same style on every screen: primary (filled blue), secondary (blue outline).                  |
| Messages   | Success, error, warning and info each with their own color and icon, always with text.        |
| Spacing    | Consistent margins and spacing (Tailwind scale); nothing crammed.                             |
| Language   | UI text in Spanish (`<html lang="es">`); prices in colones (₡).                               |

Colors are defined once as variables in `src/app/globals.css`
(`--color-primario`, `--color-acento`, `--color-fondo`, `--color-texto`,
`--color-error`, `--color-exito`) and used through Tailwind classes. Never
hard-code a color in a component.

## Landing page principles

- **Sell the visit, don't overwhelm:** few sections, short texts, large good
  quality images.
- **Two actions always at hand:** "Ver tienda" (goes to the online store) and
  "Escribinos por WhatsApp". On phones, the WhatsApp button stays fixed in a
  corner.
- **Mobile first:** most customers arrive from Instagram or Facebook on their
  phone.

## Sections

| Section               | Content and behavior                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Header                | Logo on the left; menu to the sections; "Ver tienda" button. On phones the menu opens with a button.              |
| Introduction          | Title, one sentence about who they are and a picture of the store or products. "Ver tienda" and WhatsApp buttons. |
| Featured products     | Cards: image, name, short description (2 lines max.) and price. Tapping one opens its page in the online store.   |
| Promotions and events | Cards with title, image and validity ("Hasta el 30 de noviembre"). If none are active, the section is hidden.     |
| Doctor visits         | Doctor's name, specialty, date and time. If there are no confirmed visits, the section is hidden.                 |
| Contact               | Address ("50 m este de la Municipalidad de Pérez Zeledón"), phone, map, opening hours and social media.           |
| Footer                | Social media, phone and copyright.                                                                                |

## Responsive

| Width                | Cards per row | Menu                 |
| -------------------- | ------------- | -------------------- |
| Phone (< 640 px)     | 1             | Button that opens it |
| Tablet (640–1024 px) | 2             | Full                 |
| Desktop (> 1024)     | 3–4           | Full                 |

## States

- **Loading:** grey skeletons shaped like the cards, not "loading…" texts.
- **Section with no data or with an error:** the section is hidden; the rest
  of the page stays the same.
- **Image fails to load:** generic image with the logo.

## Accessibility

- Enough contrast between text and background (WCAG AA).
- Every image has a descriptive `alt`; social media icons have an accessible
  name ("Instagram de Nativa 360").
- Everything can be used with the keyboard and the focus is visible.
- External links (WhatsApp, social media) open in a new tab and say so.

## Open questions

- Exact color codes and a high-quality logo (from the store's renewed brand
  guidelines).
- Whether promotions and events are shown on the landing page.
- Dark mode: the scaffold includes it, but the identity is blue and white.
  The proposal is to leave it out of the first version.
