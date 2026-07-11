# Prompt: Add or scaffold a section / content type

Use this to add a new public section or content type **consistently** with the
existing patterns. Read `CLAUDE.md`, `docs/sections.md`, `docs/schemas.md`, and
`docs/admin.md` first.

## Inputs (ask if missing)

- Section name (Latvian) + route slug.
- Is it editable text (goes in `pages`) or a collection (new table)?
- Fields, and which carry files (→ R2 key + required alt text).
- Does it need publish/draft, ordering, categories, a detail page?

## Steps

1. **Schema** (`docs/schemas.md` conventions):
   - Add the table with `id`, timestamps, `published`, `display_order` as needed.
   - File columns store an **R2 key**, never bytes; add an `*_alt` column for any
     content image.
   - Write the migration in `supabase/migrations/` and the **RLS policies**
     (public read of `published`; authenticated write). Run `pnpm db:types`.
2. **Public UI** (`docs/sections.md`, `docs/design-system.md`):
   - Add the route; reuse existing card/section/list components (don't re-style).
   - Server component, ISR; only `published` rows; newest-first or admin order.
   - Detail page if needed (`/[slug]`); add to the header nav in the right place.
   - Add an empty state, alt text on all images, and metadata
     (`docs/seo-metadata.md`): title, description, OG, sitemap entry, JSON-LD if apt.
3. **Admin** (`docs/admin.md`):
   - Add `/admin/<section>` list + create/edit/delete, gated by `requireAdmin()`.
   - Server-side validation; server-side file validation; upload to R2 via binding;
     `revalidatePath` after writes.
   - On delete, remove the R2 object(s) too (cascade for child rows).
4. **Tests** (`docs/testing-qa.md`):
   - Unit (slug/util), component (card/form/empty), E2E (admin create+publish →
     visible publicly → delete). Add to the smoke suite if core.
5. **Accessibility** (`docs/accessibility.md`):
   - Keyboard + screen-reader pass; headings/landmarks; focus; contrast.

## Definition of done

`lint`, `typecheck`, `test`, `build` green; only published content public; RLS
verified with the anon key; a11y pass; nav + sitemap updated; docs updated to match.
