# SEO & metadata

The site is Latvian-only and locally focused (Gulbene). Goals: be findable for the
school's name and activities, present cleanly when shared, and preserve the SEO of
the old site after cutover.

## Basics

- `<html lang="lv">` site-wide.
- Per-page `<title>` and meta description via Next.js Metadata API. Pattern:
  `"<Page> — Gulbenes Mūzikas skola"`. Descriptions in Latvian, ~150 chars, unique
  per page.
- Canonical URLs (absolute, `https://gulbenesms.lv/...`).
- Sensible, stable Latvian slugs; don't change published slugs (breaks links).

## Open Graph / social

- `og:title`, `og:description`, `og:type`, `og:locale="lv_LV"`, `og:url`,
  `og:image` (a branded default; for news/achievements/albums use the item's image).
- `twitter:card = summary_large_image`.
- Provide a default 1200×630 branded OG image in `/public/brand/`.

## Sitemap & robots

- Generate `sitemap.xml` including all public pages + published news, achievements,
  albums, and documents. Regenerate/revalidate when content changes.
- `robots.txt`: allow indexing of public content; **disallow `/admin`**. Reference
  the sitemap.
- Don't index draft/unpublished content (RLS already hides it; also avoid linking
  to it).

## Structured data (JSON-LD)

- Site/org: `EducationalOrganization` (or `MusicSchool`) with name, address
  (O. Kalpaka iela 43, Gulbene, LV-4401), phone, email, logo, `sameAs` (Facebook).
- News items: `Event` or `Article` where it fits (name, date, image, location).
- Keep it accurate; don't mark up content that isn't really there.

## Performance = SEO

Fast, accessible pages rank better and serve users better. Follow the image and
performance rules in `docs/sections.md` and `docs/testing-qa.md` (lazy-load, sized
images, WebP/AVIF, small Worker bundle, good Core Web Vitals).

## Cutover SEO (don't lose existing ranking)

- Map known old WordPress URLs to new equivalents and set **301 redirects** at
  cutover (e.g. `/galerija/`, `/kontakti/`, `/stundu-saraksts/`, …). See
  `docs/deployment.md`.
- Keep the same domain (`gulbenesms.lv`).
- After cutover, submit the new sitemap in Google Search Console and watch for
  crawl errors.

## Privacy note

Analytics, if any, must be privacy-respecting and consent-gated (e.g. a
cookieless/self-hosted option). Don't load tracking before cookie consent. See
`prompts/privacy-policy.md` and `docs/accessibility.md` (cookie banner).
