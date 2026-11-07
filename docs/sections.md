# Sections

Eight public sections. Routes use Latvian slugs. Each spec lists: route, data
source, what's static vs. admin-managed, and key UI notes. Data tables are defined
in `docs/schemas.md`; admin flows in `docs/admin.md`.

Navigation order (header), preserving the old site's style (white, uppercase,
letter-spaced, on the dark header):
`PAR SKOLU · JAUNUMI · SASNIEGUMI · GALERIJA · UZŅEMŠANA · DOKUMENTI · KONTAKTI`

Home (`/`) is reached via the logo in the top-left — no separate nav link.

All sections are direct top-level links. Routes remain flat (`/uznemsana`,
`/dokumenti`, etc.).

---

## 1. Home — `/`

Replicate the old home page's look (confirmed from the school's screenshot). One calm,
centered, single-screen hero on a **near-black** background, top to bottom:

- **Header** (shared site-wide, sticky): light horizontal logo lockup top-left;
  right-aligned uppercase white nav (see navigation above); hamburger on mobile.
- **Title:** centered, white, bold, uppercase — "GULBENES MŪZIKAS SKOLA".
- **Piano-keys graphic:** the decorative grayscale 3D piano-key fan
  (`/public/brand/piano-keys.svg`), centered, large, directly under the title.
- **Motto:** centered, white, bold, with stylized quotes —
  *"… Caur pasauli iet mūžīgs nošu raksts…"* with */Ojārs Vācietis/* on the line below.
- **Background accent:** subtle translucent vertical "piano-key" bars along the far
  left and right edges with faint amber/teal/red gradients. **Decorative only**,
  `aria-hidden`, low opacity, behind content — must not reduce text contrast
  (`docs/design-system.md`).
- **Cookie banner** pinned to the bottom (Latvian) with equal-weight "Piekrist"
  and "Noraidīt" buttons, plus a link to `/privatuma-politika`.

- **Data:** editable hero text (title + motto) from the `pages` table
  (`slug = 'home_hero'`). Optionally surface the latest few `news` items below the
  hero while keeping the original single-screen feel.

## 2. Par skolu — `/par-skolu`

### Vēsture (History)
- **Data:** `pages` table (`slug = 'about_history'`), rich text/markdown, admin-editable.

## 3. Jaunumi — `/jaunumi`

- **Purpose:** concert and event posters.
- **Data:** `news` table — poster image (R2) is primary; title + optional date +
  optional body.
- **UI:** responsive grid of poster cards, newest first; click → `/jaunumi/[slug]`
  detail (full poster + text). Paginate. Only `published` items show publicly.

## 4. Sasniegumi — `/sasniegumi`

- **Purpose:** students' competition successes — photo + description.
- **Data:** `achievements` table — photo (R2), title, event date, description,
  teacher_note (optional). No structured student/competition/result fields —
  that detail goes in the free-text title/description.
- **UI:** featured card (newest) + grid of the rest (photo + title + date),
  newest first; each links to a detail page with the full description.
- **Accessibility:** alt text (`image_alt`) is required whenever a photo is
  attached — the admin form blocks saving without it, and public pages render
  it as the image's `alt` attribute. See `docs/accessibility.md`.
- **Retention:** entries auto-expire from public view 2 years after their date
  (event date, or creation date as fallback) — see "Content expiry" below.

## 5. Galerija — `/galerija`

- **Purpose:** photo albums from events and competitions.
- **Data:** `gallery_albums` + `gallery_images` (both reference R2 keys).
- **UI:** `/galerija` shows album cover cards (cover image, title, date);
  `/galerija/[slug]` shows the album image grid with a keyboard-accessible
  lightbox. Lazy-load images; serve responsive sizes. This is the storage-heavy
  section — see image handling below.
- **Retention:** albums auto-expire from public view 2 years after their date
  (event date, or creation date as fallback) — see "Content expiry" below.

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

## Content expiry (Sasniegumi / Galerija)

Achievements and gallery albums stop being visible to the public 2 years
after their effective date (`event_date`, falling back to `created_at` if no
event date was set). This is enforced in Postgres RLS on the `anon` read
policies — not application code — so it can't be bypassed or forgotten in a
query. Nothing is deleted automatically; the admin panel flags expired
rows/albums and offers a manual bulk-delete. Full detail: `docs/schemas.md`
("Content expiry" + RLS section) and `docs/admin.md` ("Content expiry"
workflow).

## Empty states

Every list (news, achievements, albums, documents) must render a
friendly Latvian empty state when there is no published content yet — never a
blank page or an error.
