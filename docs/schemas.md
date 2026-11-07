# Schemas

Postgres (Supabase) holds **structured content and metadata only**. Files (images,
PDFs) live in **Cloudflare R2**; tables store the R2 **object key** plus metadata.

Conventions:
- `id uuid default gen_random_uuid() primary key`
- `created_at`, `updated_at timestamptz default now()` (trigger updates `updated_at`)
- Content tables have `published boolean default false` and (where ordered)
  `display_order int default 0`.
- Slugs are unique per table, generated from the Latvian title (transliterated:
  ā→a, š→s, …), lowercase, hyphenated.
- Image/file columns store an R2 key like `gallery/2026/<uuid>.webp`, never a blob
  or a full URL. Build the public URL at render time from `NEXT_PUBLIC_MEDIA_BASE_URL`.

## Tables

### `pages` — editable singleton text blocks
For home hero, history, admissions, contacts.

| column      | type        | notes                                            |
| ----------- | ----------- | ------------------------------------------------ |
| id          | uuid        |                                                  |
| slug        | text unique | `home_hero` \| `about_history` \| `admissions` \| `contacts` |
| title       | text        | optional heading                                 |
| body        | text        | markdown / rich text                             |
| updated_at  | timestamptz |                                                  |

### `news` — Jaunumi (posters)

| column      | type | notes                                   |
| ----------- | ---- | --------------------------------------- |
| id          | uuid |                                         |
| title       | text | required                                |
| slug        | text unique |                                  |
| body        | text | optional markdown                       |
| poster_key  | text | R2 key for the poster image (required)  |
| poster_alt  | text | Latvian alt text (required)             |
| event_date  | date | optional                                |
| published   | bool |                                         |
| published_at| timestamptz | set when first published         |
| created_at / updated_at | timestamptz |                     |

### `achievements` — Sasniegumi

| column       | type | notes                                  |
| ------------ | ---- | -------------------------------------- |
| id           | uuid |                                        |
| title        | text | required                               |
| description  | text | markdown                               |
| teacher_note | text | optional, internal-style note shown with the result |
| event_date   | date | optional                               |
| image_key    | text | R2 key (optional but recommended)      |
| image_alt    | text | Latvian alt text (required if image)   |
| display_order| int  |                                        |
| published    | bool |                                        |
| created_at / updated_at | timestamptz |                    |

### `gallery_albums` — Galerija (album)

| column       | type | notes                          |
| ------------ | ---- | ------------------------------ |
| id           | uuid |                                |
| title        | text | required                       |
| slug         | text unique |                         |
| description  | text | optional                       |
| cover_key    | text | R2 key for the cover image     |
| event_date   | date | optional                       |
| published    | bool |                                |
| created_at / updated_at | timestamptz |           |

### `gallery_images` — images within an album

| column        | type | notes                              |
| ------------- | ---- | ---------------------------------- |
| id            | uuid |                                    |
| album_id      | uuid | FK → gallery_albums(id) ON DELETE CASCADE |
| image_key     | text | R2 key (required)                  |
| caption       | text | optional Latvian caption           |
| alt           | text | Latvian alt text                   |
| display_order | int  |                                    |
| created_at    | timestamptz |                             |

### `documents` — Dokumenti (PDF)

| column       | type | notes                                  |
| ------------ | ---- | -------------------------------------- |
| id           | uuid |                                        |
| title        | text | required                               |
| description  | text | optional                               |
| category     | text | optional grouping (e.g. "Nolikums")    |
| file_key     | text | R2 key for the PDF (required)          |
| file_size    | int  | bytes, optional (for display)          |
| display_order| int  |                                        |
| published    | bool |                                        |
| created_at / updated_at | timestamptz |                    |

> When a row referencing a file is **deleted**, also delete the corresponding R2
> object(s) in the same server action to avoid orphaned files. For albums, cascade
> to all `gallery_images` rows **and** their R2 objects.

### Content expiry (Sasniegumi / Galerija, 2 years)

Achievements and gallery albums stop being visible to the public 2 years
after their effective date (`event_date` if set, otherwise `created_at`),
**provided they are published** — the `anon` read RLS policy ANDs `published`
and the date check as two separate conditions (see below). No row is ever
deleted automatically. The admin panel mirrors that same `published &&
expired` condition: it flags expired rows/albums with a "Vecāks par 2 gadiem"
badge and offers a manual "Dzēst novecojušos ierakstus" bulk action (reusing
the normal delete flow: DB row + R2 object cleanup) so a human confirms before
anything is permanently removed. An unpublished draft with an old
`event_date` — e.g. historical content backfilled before publishing — is
never flagged or swept, regardless of age; it only becomes eligible once
published. See migration `20260917000001_expire_old_content.sql`.

### R2 object keys are bearer tokens, not access-controlled URLs

`published` and the 2-year expiry window are enforced in Postgres RLS, which
gates reads of **rows**. They do **not** gate reads of the **R2 objects**
those rows point to. In production, media is served from the R2 custom
domain directly (`NEXT_PUBLIC_MEDIA_BASE_URL`), with no database in the
request path at all; `/api/media/[...key]` (a thin, keyless passthrough to
R2) only stands in for that in local dev, where there is no custom domain.
So anyone who already has a direct object URL — e.g. it was indexed, shared,
or saved before the row was hidden — can keep loading it indefinitely,
regardless of `published` or expiry, because **no row state ever triggers
object deletion**. Only an explicit delete (manual, or the "Dzēst
novecojušos ierakstus" bulk action) removes the R2 object (see note above).

This is a conscious tradeoff: object keys include a random UUID (not
sequentially guessable), and keeping R2 reads keyless/off the request path
is what makes media serving free and fast on the Workers plan. Enforcing
access control at read time would mean either proxying all media through a
Worker route backed by a DB check (defeats the point of the custom domain)
or issuing short-lived signed R2 URLs (meaningfully more complexity for a
small-budget site). Neither is implemented.

**Practical implication:** "Unpublish"/"Paslēpt" in the admin UI only
removes a row from public *listings* — it does not revoke access to an
already-shared link. Achievement and gallery images often depict minors, so
if a takedown or GDPR erasure request needs an image to actually stop being
reachable, the admin must use **Delete**, not Unpublish. The admin UI
surfaces this distinction inline (see `SasniegumiiManager` and
`GalerijaManager`).

## Row Level Security (RLS)

Single-admin model: any authenticated user is the admin. Enable RLS on every table.

```sql
-- enable on all content tables
alter table pages           enable row level security;
alter table news            enable row level security;
alter table achievements    enable row level security;
alter table gallery_albums  enable row level security;
alter table gallery_images  enable row level security;
alter table documents       enable row level security;

-- PUBLIC READ: anon + authenticated may read only published rows
-- (pages are always readable)
create policy "public read pages"
  on pages for select to anon, authenticated using (true);

create policy "public read published news"
  on news for select to anon, authenticated using (published);

-- achievements and gallery albums also expire 2 years after their
-- effective date (event_date, falling back to created_at) — see
-- "Content expiry" above and migration 20260917000001_expire_old_content.sql
create policy "anon read published achievements"
  on achievements for select to anon
  using (published and coalesce(event_date, created_at::date) > (now() - interval '2 years'));

create policy "anon read published albums"
  on gallery_albums for select to anon
  using (published and coalesce(event_date, created_at::date) > (now() - interval '2 years'));

create policy "anon read album images"
  on gallery_images for select to anon
  using (exists (select 1 from gallery_albums a
                 where a.id = gallery_images.album_id and a.published
                   and coalesce(a.event_date, a.created_at::date) > (now() - interval '2 years')));

create policy "public read published documents"
  on documents for select to anon, authenticated using (published);

-- ADMIN WRITE: only authenticated users may insert/update/delete.
-- Repeat the three policies below for every content table.
create policy "admin insert news" on news for insert to authenticated with check (true);
create policy "admin update news" on news for update to authenticated using (true) with check (true);
create policy "admin delete news" on news for delete to authenticated using (true);
-- … same for pages, achievements, gallery_albums, gallery_images, documents
```

> The `anon` key is safe to expose in the browser **because** RLS limits it to
> reading published rows. The `service_role` key bypasses RLS and must be used
> **server-side only** (never shipped to the client). Prefer the user's
> authenticated session for admin writes so RLS still applies; reserve
> `service_role` for trusted server tasks (e.g. seeding).

## R2 storage layout

Single bucket, foldered by section and year:

```
news/<year>/<uuid>.<ext>
achievements/<year>/<uuid>.<ext>
gallery/<album-slug>/<uuid>.<ext>
documents/<uuid>.pdf
```

- Public read via an R2 **custom domain** (e.g. `media.gulbenesms.lv`) →
  `NEXT_PUBLIC_MEDIA_BASE_URL`.
- Writes happen server-side through the Worker's R2 **binding** (production) or the
  S3 API with dev credentials (local).
- Validate MIME type and size server-side on every upload. Strip EXIF from photos
  (privacy). Convert images to WebP/AVIF on upload where feasible without breaching
  the Worker size limit (prefer client-side conversion or Cloudflare image
  resizing).

## Migrations & types

- Keep SQL migrations in `supabase/migrations/` and apply via the Supabase CLI.
- Regenerate TypeScript types after every schema change: `pnpm db:types`
  (`supabase gen types typescript`). Commit the generated `database.types.ts`.
