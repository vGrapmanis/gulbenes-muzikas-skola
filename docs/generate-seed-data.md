# Prompt: Generate seed data (development)

Create realistic Latvian sample content so the site can be built and tested before
the school provides real content. **Dev/staging only — never seed production.**

## Rules

- Use plausible Latvian text and names with correct diacritics.
- Make content clearly sample (e.g. prefix titles with "Paraugs:" or use an obvious
  marker) so it's never mistaken for real published content.
- Respect the schema in `docs/schemas.md`: file columns hold **R2 keys**, not bytes;
  include required alt text for images.
- Seed via a script that uses the **`service_role`** key server-side (so it can
  write regardless of RLS) against the **dev** Supabase project, and uploads any
  placeholder media to the **dev** R2 bucket. Make it idempotent and reversible
  (a matching "unseed" that also deletes the R2 objects).

## What to generate

- **pages:** home hero (with the Ojārs Vācietis motto), about_history (a few
  paragraphs), admissions, contacts (address O. Kalpaka iela 43, Gulbene, LV-4401;
  phone +371 64471659; sample bank requisites).
- **news:** ~6 items with placeholder posters + dates; mix of published and draft to
  test visibility.
- **achievements:** ~5 items (student, competition, result like "1. vieta",
  description, placeholder photo).
- **gallery:** ~3 albums, each with 6–12 placeholder images, covers, captions, alt.
- **documents:** ~4 placeholder PDFs across 2 categories.

## Placeholder media

Generate or use lightweight placeholder images/PDFs (clearly marked as samples).
Keep file sizes small. Upload to the dev R2 bucket under the foldering in
`docs/schemas.md` and store the returned keys.

## After seeding

Confirm: every section renders with content, empty states are no longer shown,
drafts are hidden when logged out, and the gallery lightbox has enough images to
test. Provide the command to unseed.
