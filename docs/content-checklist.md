# Content checklist (before launch)

Because we build from scratch with no access to the old site, content must be
gathered fresh from the school. Use this as the pre-launch gate: the site is not
ready to replace the old one until each item is resolved (provided, or explicitly
deferred with the school's sign-off).

## ⚠️ Open questions to resolve with the school first

- [x] **Old home layout** — received (school screenshot); home spec updated in
      `docs/sections.md` and `docs/design-system.md`. Still to confirm: the
      **Kontakti** page layout (old contacts page reference not yet provided).
- [ ] **Official brand files** — confirm the supplied logo/asset set is final and
      complete (dark + light variants of each lockup, favicon source).
- [ ] **Exact contact details & bank requisites** — confirm current and correct.
- [ ] **Who controls `gulbenesms.lv` DNS** — needed for the cutover and the R2
      media subdomain. (See `docs/deployment.md`.)
- [ ] **Accessibility statement details** — responsible body, contact for feedback,
      and enforcement-procedure wording (public-sector requirement).
- [ ] **Privacy policy inputs** — controller, contact (DPO if any), what data is
      processed, hosting locations (Supabase EU, Cloudflare). Use
      `prompts/privacy-policy.md`.

## Per-section content

### Home (`/`)
- [ ] Hero text / motto (the Ojārs Vācietis quote is already known).
- [x] Layout confirmed (school screenshot) → see `docs/sections.md`.

### Par skolu — Vēsture
- [ ] History text (Latvian). Founded 1959; founder Gulbenes novada dome; programs
      offered; collectives; key milestones.

### Par skolu — Absolventi
- [ ] Graduate lists per year (year, names, optional program/teacher). Decide how
      many years back to include.

### Jaunumi
- [ ] At least a few current/upcoming concert & event posters (image + title + date).

### Sasniegumi
- [ ] A set of recent competition results (photo, student, competition, result,
      short description).

### Galerija
- [ ] A few starter albums (title, date, cover, images with Latvian alt text).

### Uzņemšana
- [ ] Admissions text: when/how to apply (historically late May–early June),
      programs, requirements, contacts.

### Dokumenti
- [ ] PDFs to publish (e.g. nolikums, uzņemšanas noteikumi, līdzfinansējums,
      stundu saraksts) with titles and categories. Confirm each PDF is the current
      version and reasonably accessible.

### Kontakti
- [ ] Address: O. Kalpaka iela 43, Gulbene, LV-4401.
- [ ] Phone: +371 64471659. Email (confirm correct address).
- [ ] Bank requisites for parent co-financing (confirm).
- [ ] No form, no decorative images. Map only via privacy-respecting method.

## Site-wide content

- [ ] Latvian navigation labels and footer text.
- [ ] Cookie-consent banner copy (Latvian).
- [ ] Privacy policy page (Latvian) — generated, reviewed, approved.
- [ ] Accessibility statement page (Latvian).
- [ ] 404 and error pages (Latvian, on-brand).
- [ ] Favicon + social share (OG) image.
- [ ] Every content image has meaningful Latvian alt text.

## Sign-off

- [ ] School reviews staging site and approves content + design.
- [ ] Accessibility and QA passes complete (`docs/accessibility.md`,
      `docs/testing-qa.md`).
- [ ] Legal pages approved.
- [ ] DNS cutover plan agreed (`docs/deployment.md`).
