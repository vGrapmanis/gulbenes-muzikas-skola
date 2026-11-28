# CLAUDE.md — Gulbenes Mūzikas skola website

This file is the entry point for Claude Code working on this repository. Read it
fully before doing anything. When a task touches a specific area, also read the
matching file in `docs/`.

---

## 1. What this project is

A new public website for **Gulbenes Mūzikas skola** (Gulbene Music School), a
municipal professional-orientation music school in Gulbene, Latvia (founded 1959,
operated by Gulbenes novada pašvaldība).

The old site (`https://gulbenesms.lv/`) is a WordPress site. We are **rebuilding
from scratch** — there is no migration and no access to the old database. When the
new site is approved it will replace the old one on the same domain.

This is a **public-sector institution website**. That carries hard requirements:
WCAG 2.1 AA accessibility + a published accessibility statement, GDPR-compliant
privacy policy and cookie consent, and EU-region data hosting. These are not
optional polish — treat them as acceptance criteria (`docs/accessibility.md`).

## 2. Language convention (important)

- **Code, comments, commit messages, docs, identifiers → English.**
- **Everything the visitor or admin sees → Latvian.** All UI labels, buttons,
  errors, emails, metadata, and content are Latvian. Latvian uses diacritics
  (ā ē ī ū ō č ģ ķ ļ ņ ŗ š ž). Every font, input, slug generator, and search
  must handle them correctly. Never strip or transliterate diacritics in
  visible text. Slugs may transliterate (ā→a) but the display title keeps them.

## 3. Stack (do not change without an explicit decision)

| Concern        | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js (App Router) + TypeScript                             |
| Styling        | Tailwind CSS, tokens from `docs/design-system.md`             |
| DB             | Supabase (Postgres) with Row Level Security                   |
| Auth           | Supabase Auth — **single shared admin account**               |
| Image/file storage | Cloudflare **R2** (S3-compatible), bound to the Worker    |
| Hosting        | Cloudflare Workers via `@opennextjs/cloudflare`               |
| Domain         | `gulbenesms.lv` (cut over after approval)                     |

Rationale and alternatives live in `docs/architecture.md`.

## 4. The golden rules (read these twice)

1. **Never store image or PDF bytes in the database.** The DB stores only an R2
   object key + metadata (title, caption, order, dates). Files live in R2. This
   is the whole reason the gallery stays cheap and fast. See `docs/schemas.md`.
2. **Target the Node.js runtime, never the Edge runtime.** `@opennextjs/cloudflare`
   runs on Workers with Node compat. Do **not** add `export const runtime = 'edge'`.
   Note `cookies()` from `next/headers` is Node-only and does not work in
   `middleware.ts` on Workers — keep Supabase session handling in server
   components / route handlers, not in middleware. See `docs/deployment.md`.
3. **Keep the Worker bundle under 3 MiB gzipped** (Workers free plan limit). Avoid
   heavy server-side deps; prefer dynamic import; audit bundle before merging.
4. **Public visitors only ever read `published` content.** Writes require an
   authenticated admin. Enforced in Postgres via RLS, not just in the UI.
   Sasniegumi and Galerija also auto-expire from public view 2 years after
   their date — same RLS-level enforcement, no auto-deletion. See
   `docs/schemas.md` and `docs/sections.md`.
5. **Accessibility and GDPR are acceptance criteria**, not extras. A feature is
   not "done" until it passes `docs/accessibility.md`.
6. **Brand is near-monochrome and high-contrast.** Ink `#201820`, black `#000000`,
   paper `#F8F8F8`, a gray scale, piano-key graphic as the main accent. The only
   color is a subtle translucent gradient in *background* decoration (home hero edge
   bars) — never on text, the logo, or controls. See `docs/design-system.md`.
7. **Secrets never go in the repo.** Supabase keys, R2 credentials, and the admin
   service role key live in environment variables / Wrangler secrets only.

## 5. Site sections (8)

1. **Home** (`/`) — replicate the old home (layout confirmed from the school's
   screenshot): near-black hero with centered title + piano-key fan graphic + the
   Ojārs Vācietis motto, and subtle decorative gradient edge bars. See `docs/sections.md`.
2. **Par skolu** (About) — Vēsture (text).
3. **Jaunumi** (News) — concert/event posters.
4. **Sasniegumi** (Achievements) — competition results, photo + description.
   Auto-expires from public view 2 years after posting.
5. **Galerija** (Gallery) — albums of images from events/competitions.
   Auto-expires from public view 2 years after posting.
6. **Uzņemšana** (Admissions) — informational text.
7. **Dokumenti** (Documents) — PDFs, view in new tab or download.
8. **Kontakti** (Contacts) — like the old site, **no form and no images**.

Full per-section spec: `docs/sections.md`.

## 6. Admin

A single shared admin login can create/edit/delete: news, achievements, gallery
albums + images, documents, and the editable text pages (history, admissions,
contacts, home hero). Spec: `docs/admin.md`.

## 7. Repository map

```
CLAUDE.md                 ← you are here
docs/README.md            ← human setup instructions
docs/
  architecture.md         stack, data flow, env, hosting model
  design-system.md        palette, type, spacing, components, brand assets
  sections.md             spec for each of the 8 sections (routes + data)
  schemas.md              Postgres tables, RLS, R2 buckets, SQL
  admin.md                auth, single-admin model, content workflows
  content-checklist.md    what content must exist before launch
  deployment.md           Cloudflare Workers + R2 + Supabase deploy + DNS
  accessibility.md        WCAG 2.1 AA checklist + accessibility statement
  testing-qa.md           QA strategy, test matrix, tooling
  seo-metadata.md         metadata, sitemap, lv lang, OG, structured data
  privacy-policy.md       generate GDPR privacy policy (Latvian output)
  optimize-codebase.md    perf / refactor / cleanup pass
  new-section.md          scaffold a new section consistently
  qa-review.md            run a QA pass against testing-qa.md
  accessibility-audit.md  run an a11y audit
  generate-seed-data.md   create sample content for development
assets/                   ← brand PNGs supplied by the school; see §10
dokumenti/                ← seed PDFs for the Dokumenti section; see §10
```

## 8. Commands (fill in once scaffolded)

```bash
pnpm install                 # install deps
pnpm dev                     # Next.js dev server (http://localhost:3000)
pnpm lint                    # eslint
pnpm typecheck               # tsc --noEmit
pnpm test                    # unit/component tests
pnpm build                   # next build
pnpm preview                 # opennextjs-cloudflare build + wrangler preview
pnpm run deploy              # build + wrangler deploy (production)
pnpm run deploy:preview      # build + wrangler deploy --env preview
pnpm db:types                # regenerate Supabase TS types
```

Always run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before declaring a task
done. Never commit if the build is red.

## 9. Working style for Claude Code

- Read the relevant `docs/*.md` before editing; keep them in sync when behavior
  changes. The docs are the source of truth, not the other way around.
- Make small, reviewable changes. One concern per PR.
- The maintainer is **non-technical and Latvian-speaking**. Optimize the admin UX
  and any user-facing copy for that person, not for developers.
- When something is ambiguous (e.g. the old home layout), surface it as a question
  rather than guessing silently.

## 10. Local asset directories

### `assets/` — brand PNGs from the school

Official brand files supplied by GMS. These are **source files**, not
production-ready assets. During scaffolding, copy/convert them into
`public/brand/` following the naming scheme in `docs/design-system.md`.

| File                      | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `GMS Logo.png`            | Primary logo source                        |
| `klavieres-plus-teksts.png` | Piano-key fan graphic with text overlay  |
| `Asset 3.png` – `Asset 6.png` | Additional brand/graphic variants      |
| `1.png` – `6.png`         | Numbered design variants (confirm mapping) |
| `image.png`               | Reference image                            |

Convert to SVG where possible; keep PNG fallbacks. Never serve files directly
from `assets/` — they must land in `public/brand/` (tracked in git as static
assets) or be uploaded to R2 if they are content images.

### `dokumenti/` — seed PDFs for the Dokumenti section

Nine PDFs with the school's current official documents. These are **content,
not code** — do not bundle them in the repo or the Worker. They must be:

1. Uploaded to R2 under `documents/<uuid>.pdf` during environment setup.
2. Seeded into the `documents` table (via admin UI or a seed script).

Suggested titles and categories for seeding:

| File | Latvian title | Category |
| ---- | ------------- | -------- |
| `NOLIKUMS_GMS2025.pdf` | Nolikums | Skolas dokumenti |
| `Ieksejas-kartibas-noteikumi_2025.pdf` | Iekšējās kārtības noteikumi | Skolas dokumenti |
| `Drosibas-noteikumi_2025.pdf` | Drošības noteikumi | Skolas dokumenti |
| `Vertesanas-kartiba_2025.pdf` | Vērtēšanas kārtība | Mācību process |
| `Uznemsanas-noteikumi_2025.pdf` | Uzņemšanas noteikumi | Mācību process |
| `Parcelsana_beigsana_atskaitisana_2025.pdf` | Pārcelšana, beigšana, atskaitīšana | Mācību process |
| `Izglitojamo-vecaku-un-citu-nepiederosu-personu-uzturesanas-kartiba_2025.pdf` | Izglītojamo, vecāku un citu nepiederošu personu uzturēšanās kārtība | Kārtība |
| `GMS-Attistibas-plans_2022_25_pabeigts.pdf` | Attīstības plāns 2022–2025 | Plānošana |
| `Pasnovertejuma-zinojums-2024_25_publisk.d.pdf` | Pašnovērtējuma ziņojums 2024/25 | Pārskati |
