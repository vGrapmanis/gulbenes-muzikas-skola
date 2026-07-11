# Architecture

## Overview

A Next.js (App Router) application deployed to Cloudflare Workers. Structured
content lives in Supabase Postgres; image and PDF files live in Cloudflare R2.
Authentication for the single admin uses Supabase Auth. Public pages are mostly
static / incrementally revalidated; the admin area is dynamic and authenticated.

```
                 ┌────────────────────────────┐
   Visitor ────► │  Cloudflare Worker          │
                 │  (Next.js via OpenNext)     │
   Admin ──────► │                             │
                 │  - public pages (RSC, ISR)  │
                 │  - /admin (auth-gated)       │
                 │  - route handlers / actions │
                 └─────┬───────────────┬───────┘
                       │               │
            reads/writes│         binding│ (uploads + reads)
                       ▼               ▼
              ┌─────────────┐   ┌──────────────┐
              │  Supabase   │   │ Cloudflare   │
              │  Postgres   │   │ R2 bucket    │
              │  + Auth     │   │ (images/PDF) │
              │  (RLS)      │   └──────────────┘
              └─────────────┘          │
                                       │ public reads
                                       ▼
                              media.gulbenesms.lv (R2 custom domain)
```

## Why this stack

The two hard constraints were **maximize free tier** and **no pain with the
photo/gallery database**.

- **Images never touch the relational DB.** R2 is object storage with a generous
  free tier (10 GB storage, no egress fees), so an ever-growing gallery never
  bloats Postgres or runs up bandwidth bills. The DB stores only keys + metadata.
- **Cloudflare Workers free tier** has no "non-commercial only" restriction
  (unlike Vercel Hobby), which matters for a public institution. R2, Workers, and
  the custom domain all sit in one Cloudflare account.
- **Supabase** gives Postgres + Auth + RLS on a free tier, in an EU region
  (Frankfurt) for GDPR. We use it for structured data and the single admin login,
  but **not** for file storage here (R2 wins on free storage + egress).
- **Next.js + `@opennextjs/cloudflare`** is the Cloudflare-recommended way to run
  Next.js on Workers, supporting SSR, ISR, middleware-ish patterns, and the
  Node.js runtime.

### Alternatives considered

- **Vercel + Supabase Storage** — simplest DX, but Vercel Hobby is non-commercial
  (gray area for a public body) and Supabase Storage free is only 1 GB.
- **Astro + Decap/Sveltia (git-based CMS)** — zero backend, but galleries with many
  images in git are awkward and the editorial flow needs GitHub. Rejected as
  primary for a gallery-heavy, non-technical-maintainer site.
- **PocketBase (self-hosted)** — great all-in-one, but needs a persistent host;
  truly-free persistent hosting is scarce.

## Rendering strategy

- **Public content pages** (home, about, news list, achievements, gallery,
  admissions, documents, contacts): server components with **ISR**
  (`revalidate`), so they are fast and cache well, and refresh after admin edits.
  Trigger on-demand revalidation (`revalidatePath`) from admin write actions so
  changes appear immediately.
- **Detail pages** (single news item, single album): same pattern; generate
  static params for known published slugs where helpful.
- **Admin area** (`/admin/**`): dynamic, never cached, authenticated.

## Data flow for an admin upload

1. Admin authenticates (Supabase Auth) → session cookie.
2. Admin submits a form (e.g. new gallery image) to a **server action / route
   handler** running in the Worker.
3. The handler verifies the session server-side, then writes the file to R2 via
   the **R2 binding** and inserts a row in Postgres with the R2 object key.
4. The handler calls `revalidatePath` for the affected public route.
5. Public visitors load the page; image `src` is built from
   `NEXT_PUBLIC_MEDIA_BASE_URL` + object key (served from R2 custom domain).

## Runtime constraints (must respect)

- **Node.js runtime only.** Never `export const runtime = 'edge'`.
- **`cookies()` is Node-only** and does not run in `middleware.ts` on Workers.
  Do Supabase session checks in server components / route handlers, not middleware.
- **3 MiB gzipped Worker limit** on the free plan. Keep server deps lean; dynamic
  import heavy modules; do image processing client-side or via R2/Cloudflare Images
  rather than bundling heavy libs server-side.

## Environments

| Env       | DB / Auth            | Storage        | Host                         |
| --------- | -------------------- | -------------- | ---------------------------- |
| local     | Supabase (dev proj.) | R2 (dev bucket)| `pnpm dev`                   |
| preview   | Supabase (dev proj.) | R2 (dev bucket)| `wrangler preview` / branch  |
| production| Supabase (prod proj.)| R2 (prod bucket)| Workers → `gulbenesms.lv`   |

Keep dev and prod Supabase projects (and R2 buckets) separate so test content
never reaches production.
