# Gulbenes Mūzikas skola — website

Public website for Gulbenes Mūzikas skola (Gulbene Music School, Latvia), with a
single-admin content panel for news, achievements, galleries, graduates, and
documents.

> **For Claude Code / AI agents:** start with [`CLAUDE.md`](./CLAUDE.md), then the
> relevant file in [`docs/`](./docs).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth)
- Cloudflare R2 (image/PDF storage) + Cloudflare Workers (`@opennextjs/cloudflare`)

## Quick start

```bash
pnpm install
cp .env.example .env.local      # fill in Supabase + R2 values
pnpm dev                        # http://localhost:3000
```

You need:

- A Supabase project (EU region — Frankfurt) → URL + anon key + service role key.
- A Cloudflare account with an R2 bucket and API token.

See [`docs/deployment.md`](./docs/deployment.md) for full environment setup.

## Environment variables

See `.env.example`. Never commit real values.

| Variable                        | Used for                          |
| ------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase client                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client (public, RLS-safe)|
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only admin operations      |
| `R2_ACCOUNT_ID`                 | R2 access                         |
| `R2_ACCESS_KEY_ID`              | R2 access (local/dev S3 API)      |
| `R2_SECRET_ACCESS_KEY`          | R2 access (local/dev S3 API)      |
| `R2_BUCKET`                     | R2 bucket name                    |
| `NEXT_PUBLIC_MEDIA_BASE_URL`    | Public base URL for R2 media      |

In production on Workers, R2 is accessed through a **binding** (no keys needed in
the Worker); the S3-style keys above are mainly for local development.

## Documentation

| File | Purpose |
| ---- | ------- |
| `docs/architecture.md`   | How the pieces fit together |
| `docs/design-system.md`  | Colors, type, components, brand assets |
| `docs/sections.md`       | Spec for all 8 sections |
| `docs/schemas.md`        | Database tables + RLS + storage |
| `docs/admin.md`          | Admin login + content management |
| `docs/content-checklist.md` | Launch content checklist |
| `docs/deployment.md`     | Deploy + DNS cutover |
| `docs/accessibility.md`  | WCAG 2.1 AA + accessibility statement |
| `docs/testing-qa.md`     | QA process and test matrix |
| `docs/seo-metadata.md`   | Metadata, sitemap, structured data |

Reusable task prompts for Claude Code live in `prompts/`.

## License / ownership

Owned by Gulbenes novada pašvaldība. Internal project; not for redistribution.
