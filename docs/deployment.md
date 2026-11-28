# Deployment

Target: **Cloudflare Workers** (via `@opennextjs/cloudflare`) + **Cloudflare R2**
(media) + **Supabase** (Postgres + Auth, EU/Frankfurt region). Final domain:
`gulbenesms.lv`, with media on `media.gulbenesms.lv`.

> Verify versions against current docs at deploy time — this area moves fast.
> `@opennextjs/cloudflare` is Cloudflare's recommended adapter for Next.js on
> Workers and requires **Wrangler ≥ 3.99.0**.

## One-time setup

### 1. Supabase
1. Create a project in the **EU (Frankfurt)** region (GDPR).
2. Run the migrations in `supabase/migrations/` (RLS from `docs/schemas.md`).
3. Disable public sign-ups; create the single admin user manually.
4. Copy `Project URL`, `anon` key, and `service_role` key.

### 2. Cloudflare R2
1. Create a bucket (e.g. `gms-media-prod`; separate `gms-media-dev` for dev).
2. Attach a **custom domain** `media.gulbenesms.lv` for public reads → set as
   `NEXT_PUBLIC_MEDIA_BASE_URL`.
3. For local dev, create an R2 API token (S3-compatible) for the dev bucket.

### 3. Next.js + adapter
```bash
pnpm add @opennextjs/cloudflare
pnpm add -D wrangler
```
Create `wrangler.jsonc` (the adapter can scaffold it) with the R2 binding:
```jsonc
{
  "name": "gulbenes-muzikas-skola",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "r2_buckets": [
    { "binding": "MEDIA", "bucket_name": "gms-media-prod" }
  ]
}
```
Add scripts to `package.json`:
```json
{
  "preview": "opennextjs-cloudflare build && wrangler dev",
  "deploy":  "opennextjs-cloudflare build && wrangler deploy"
}
```
Keep `build` as plain `next build`: `opennextjs-cloudflare build` calls
`pnpm build` internally, so pointing `build` at it would recurse. Locally, run
the deploy script as `pnpm run deploy` — bare `pnpm deploy` is a built-in pnpm
command and does not run our script.

### 4. Cloudflare Workers Builds (dashboard)
The Worker is connected to the Git repo and built by Cloudflare. In
**Workers & Pages → `gulbenes-muzikas-skola` → Settings → Build**:

| Setting        | Value                                     |
| -------------- | ----------------------------------------- |
| Build command  | `pnpm exec opennextjs-cloudflare build`   |
| Deploy command | `pnpm exec opennextjs-cloudflare deploy`  |

Do **not** use `pnpm run build` as the build command: it only runs `next build`
and never produces `.open-next/worker.js`, so the deploy step fails because
`wrangler.jsonc` points `main` at that file. The pnpm version comes from the
`packageManager` field in `package.json`.

Under **Settings → Build → Build variables and secrets** add the `NEXT_PUBLIC_*`
values. Next.js inlines them into the bundle at build time, so if they are
missing the site builds without a Supabase connection:

| Variable                        | Value                                   |
| ------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Project URL                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase `anon` key (mark as secret)    |
| `NEXT_PUBLIC_MEDIA_BASE_URL`    | `/api/media` (default if unset)         |

The `R2_*` keys from `.env.example` are for local dev only; the deployed Worker
uses the `MEDIA` R2 binding.

## Environment variables / secrets

Local (`.env.local`): see `README.md`. Production secrets go to the Worker via
Wrangler — **never commit them**:
```bash
wrangler secret put NEXT_PUBLIC_SUPABASE_URL
wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```
(`NEXT_PUBLIC_*` values are also inlined at build time; keep build env and Worker
secrets consistent.)

> **`NEXT_PUBLIC_MEDIA_BASE_URL` is build-time only.** `pnpm deploy` builds locally
> and reads `.env.local`, so whatever is there ends up in production. Never set it
> to a `http://localhost…` URL — that broke all images on the live site once. Use
> `/api/media` (same-origin R2 proxy, the default) or `https://media.gulbenesms.lv`
> only if that R2 custom domain is actually attached. The R2 binding means no R2 keys are needed in the Worker.

## Build constraints

- **Node.js runtime only** — never `export const runtime = 'edge'`.
- **No `cookies()` in `middleware.ts`** on Workers — gate `/admin` in server
  components/actions instead (`requireAdmin()`).
- **Worker ≤ 3 MiB gzipped** (free plan). After build, check the size Wrangler
  reports. If close, audit the server bundle: dynamic-import heavy deps, avoid
  bundling image libs server-side, trim unused locales.

## CI/CD (GitHub Actions)

Pipeline on PR and on `main`:
1. `pnpm install`
2. `pnpm lint && pnpm typecheck && pnpm test`
3. `pnpm build`
4. On `main` only: `opennextjs-cloudflare build && wrangler deploy` (using a
   `CLOUDFLARE_API_TOKEN` repo secret).

Use a preview deploy (branch/PR) so the school can review before production.

## DNS cutover (replacing the old site)

Plan with whoever controls `gulbenesms.lv` DNS:
1. Deploy and fully validate on a temporary hostname / preview URL.
2. Get school sign-off (content, design, accessibility, QA, legal pages).
3. Pre-create `media.gulbenesms.lv` (R2) ahead of cutover.
4. Lower DNS TTL a day before cutover.
5. Point the apex/`www` record to the Worker. This is declared in `wrangler.jsonc`
   as `routes` with `custom_domain: true` for `gulbenesms.lv` and
   `www.gulbenesms.lv`, so each deploy creates/keeps the DNS record and
   certificate. Remove any existing apex/`www` A/AAAA/CNAME record first or the
   deploy fails. `env.preview` sets `routes: []` so preview never claims them.
6. Verify HTTPS, all 8 sections, admin login, an upload, and the legal pages on the
   live domain.
7. Set up redirects from any old WordPress URLs that have inbound links
   (`/galerija/`, `/kontakti/`, `/stundu-saraksts/`, etc.) to the new equivalents
   to preserve SEO.
8. Keep a rollback path (old site reachable) until the new site is confirmed stable.

## Backups & ops

- Supabase: enable scheduled backups; keep migrations in git as the schema source.
- R2: media is the only large asset store — consider periodic export/lifecycle
  rules. Deleting content also deletes its R2 object (see `docs/admin.md`), so
  there's no orphan cleanup needed if that's done consistently.
- Monitor Worker errors (Cloudflare dashboard / Logpush) and uptime.
