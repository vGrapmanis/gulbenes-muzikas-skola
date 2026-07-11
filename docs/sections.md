# Sections

Eight public sections. Routes use Latvian slugs. Each spec lists: route, data
source, what's static vs. admin-managed, and key UI notes. Data tables are defined
in `docs/schemas.md`; admin flows in `docs/admin.md`.

Navigation order (header), preserving the old site's dropdown style (white,
uppercase, letter-spaced, on the dark header):
`SĀKUMLAPA · PAR SKOLU ▾ (Vēsture, Absolventi) · JAUNUMI · SASNIEGUMI · GALERIJA ·
INFORMĀCIJA ▾ (Uzņemšana, Dokumenti) · KONTAKTI`

Two dropdowns ("Par skolu", "Informācija") group the sub-pages so the top bar stays
close to the original. Routes remain flat (`/uznemsana`, `/dokumenti`, etc.).

---

## 1. Sākumlapa — `/`

Replicate the old home page's look (confirmed from the school's screenshot). One calm,
centered, single-screen hero on a **near-black** background, top to bottom:

- **Header** (shared site-wide, sticky): light horizontal logo lockup top-left;
  right-aligned uppercase white nav with the two dropdowns (see navigation above);
  hamburger on mobile.
- **Title:** centered, white, bold, uppercase — "GULBENES MŪZIKAS SKOLA".
- **Piano-keys graphic:** the decorative grayscale 3D piano-key fan
  (`/public/brand/piano-keys.svg`), centered, large, directly under the title.
- **Motto:** centered, white, bold, with stylized quotes —
  *"… Caur pasauli iet mūžīgs nošu raksts…"* with */Ojārs Vācietis/* on the line below.
- **Background accent:** subtle translucent vertical "piano-key" bars along the far
  left and right edges with faint amber/teal/red gradients. **Decorative only**,
  `aria-hidden`, low opacity, behind content — must not reduce text contrast
  (`docs/design-system.md`).
- **Cookie banner** pinned to the bottom (Latvian) with a "Piekrist" button.

- **Data:** editable hero text (title + motto) from the `pages` table
  (`slug = 'home_hero'`). Optionally surface the latest few `news` items below the
  hero while keeping the original single-screen feel.

## 2. Par skolu — `/par-skolu`

Two subsections on one page (or `/par-skolu` + `/par-skolu/absolventi`):

### Vēsture (History)
- **Data:** `pages` table (`slug = 'about_history'`), rich text/markdown, admin-editable.

### Absolventi (Graduates)
- **Data:** `graduates` table. **Cards grouped by year**, each card lists that
  year's graduates (name, optional program/instrument, optional teacher).
- **UI:** newest year first; year is the card heading; within a card, an
  alphabetical or admin-ordered list of names. Consider a year filter if many.
- Admin adds graduates one at a time (year + name + optional fields); the page
  groups them into cards automatically.

## 3. Jaunumi — `/jaunumi`

- **Purpose:** concert and event posters.
- **Data:** `news` table — poster image (R2) is primary; title + optional date +
  optional body.
- **UI:** responsive grid of poster cards, newest first; click → `/jaunumi/[slug]`
  detail (full poster + text). Paginate. Only `published` items show publicly.

## 4. Sasniegumi — `/sasniegumi`

- **Purpose:** students' competition successes — photo + description.
- **Data:** `achievements` table — photo (R2), title, student name, competition,
  result (e.g. "1. vieta"), date, description.
- **UI:** card grid (photo + result + student + short text), newest first; optional
  detail page. Make the result/placement visually prominent.

## 5. Galerija — `/galerija`

- **Purpose:** photo albums from events and competitions.
- **Data:** `gallery_albums` + `gallery_images` (both reference R2 keys).
- **UI:** `/galerija` shows album cover cards (cover image, title, date);
  `/galerija/[slug]` shows the album image grid with a keyboard-accessible
  lightbox. Lazy-load images; serve responsive sizes. This is the storage-heavy
  section — see image handling below.

## 6. Uzņemšana — `/uznemsana`

- **Purpose:** admissions information (text).
- **Data:** `pages` table (`slug = 'admissions'`), rich text/markdown, admin-editable.
- **UI:** readable long-form text; may embed/list relevant items from `documents`
  (e.g. admission rules) by category.

## 7. Dokumenti — `/dokumenti`

- **Purpose:** PDFs the public can **view in a new tab or download**.
- **Data:** `documents` table — title, optional description, optional category,
  R2 key, order.
- **UI:** grouped by category; each row has a "Skatīt" (open in new tab,
  `target="_blank" rel="noopener"`) and "Lejupielādēt" (download) action. Show file
  type/size where available. Ensure PDFs themselves are reasonably accessible.

## 8. Kontakti — `/kontakti`

- **Purpose:** contact info **like the old site, but no contact form and no images.**
- **Data:** `pages` table (`slug = 'contacts'`) for the editable text block, which
  includes: address (O. Kalpaka iela 43, Gulbene, LV-4401), phone (+371 64471659),
  email, and the school's bank requisites for parent co-financing.
- **UI:** clean text layout. An embedded map is optional and **only** via a
  privacy-respecting method (static map image or lazy "click to load") to avoid
  third-party tracking before consent. No form. No decorative photos.

---

## Image handling (applies to news / achievements / gallery)

- Store the **original** in R2; generate/serve responsive sizes. Use `next/image`
  with a custom loader pointing at the R2 custom domain (or Cloudflare Images /
  Cloudflare resizing) so we don't bundle heavy image libs into the Worker.
- Always set meaningful Latvian `alt` text (admin provides it; never leave empty
  for content images). Decorative-only images get `alt=""`.
- Lazy-load below-the-fold images; set explicit width/height to avoid layout shift.
- Accept common formats; prefer serving WebP/AVIF. Cap upload size in the admin and
  validate type server-side.

## Empty states

Every list (news, achievements, albums, graduates, documents) must render a
friendly Latvian empty state when there is no published content yet — never a
blank page or an error.
