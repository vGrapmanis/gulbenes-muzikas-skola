# Testing & QA

QA is part of building each feature, not a phase at the end. A task is "done" only
when lint, types, tests, and the relevant manual checks below pass.

## Layers

| Layer        | Tool (suggested)              | What it covers                         |
| ------------ | ----------------------------- | -------------------------------------- |
| Static       | ESLint, `tsc --noEmit`, Prettier | types, lint, format               |
| Unit         | Vitest                        | utils (slugify w/ diacritics, grouping, URL building) |
| Component    | Vitest + Testing Library      | cards, forms, lightbox, empty states   |
| E2E          | Playwright                    | nav, public flows, admin CRUD + upload |
| Accessibility| axe-core / Playwright + manual| WCAG 2.1 AA (see `docs/accessibility.md`) |
| Performance  | Lighthouse / Lighthouse CI    | LCP, CLS, image loading, bundle        |

Gate in CI: `lint` + `typecheck` + `unit/component` on every PR; E2E + Lighthouse +
axe on PRs touching the relevant areas and on `main`.

## Functional test matrix (public)

- [ ] All 8 sections render and are reachable from the nav on desktop and mobile.
- [ ] Latvian text renders correctly everywhere (diacritics intact in titles,
      slugs, search, metadata).
- [ ] Only `published` content is visible to anonymous visitors (verify a draft is
      hidden when logged out).
- [ ] A Sasniegumi/Galerija item dated >2 years ago is hidden from anonymous
      visitors but still visible (with an "expired" badge) in the admin panel;
      the admin's manual "delete expired" action removes it and its R2 file(s).
- [ ] **Jaunumi:** grid + detail, newest first, pagination, posters load with alt.
- [ ] **Sasniegumi:** cards show result/student/description + photo; detail works.
- [ ] **Galerija:** album list → album grid → lightbox (keyboard + screen reader).
- [ ] **Absolventi:** graduates grouped into correct year cards, ordered.
- [ ] **Dokumenti:** "Skatīt" opens PDF in new tab; "Lejupielādēt" downloads; grouped
      by category.
- [ ] **Uzņemšana / Vēsture / Kontakti:** editable text renders; Kontakti has **no
      form and no images**; contact details + requisites correct.
- [ ] Empty states show for every list when there's no published content.
- [ ] 404 and error pages are on-brand and in Latvian.
- [ ] Cookie consent appears, remembers choice, and blocks any non-essential
      third-party (e.g. map) until accepted.

## Functional test matrix (admin)

- [ ] Login works; wrong credentials show a generic Latvian error; logout works.
- [ ] `/admin/**` is inaccessible when logged out (redirects to login) — verify it's
      gated server-side, not just hidden in UI.
- [ ] Create/edit/delete for each content type persists correctly.
- [ ] Image/PDF upload writes to R2 and stores the key; the asset is publicly
      reachable via `NEXT_PUBLIC_MEDIA_BASE_URL`.
- [ ] **Delete removes the R2 object too**; deleting an album cascades to its images
      and their R2 objects (no orphans).
- [ ] Publish/draft toggle controls public visibility immediately
      (revalidation works).
- [ ] Server-side validation rejects oversized/wrong-type files and missing
      required fields, with Latvian messages, without losing input.
- [ ] Alt text is required for content images (can't publish without it).

## Security checks

- [ ] `service_role` key never reaches the client bundle (grep the build output).
- [ ] RLS verified directly: with only the `anon` key, you cannot read unpublished
      rows or write anything.
- [ ] No secrets in the repo or in `NEXT_PUBLIC_*` that shouldn't be public.
- [ ] Uploads validated server-side (not just client-side).
- [ ] External links use `rel="noopener"`; user content is escaped/sanitized.

## Performance checks

- [ ] Images lazy-loaded, sized (no CLS), served WebP/AVIF in responsive sizes.
- [ ] Worker bundle ≤ 3 MiB gzipped.
- [ ] Lighthouse: Performance, Accessibility, Best Practices, SEO all strong
      (aim ≥ 90 each) on home, a gallery album, and the documents page.

## Cross-browser / device

- [ ] Latest Chrome, Firefox, Safari, Edge.
- [ ] Mobile Safari (iOS) and Chrome (Android); test the gallery and the admin
      upload flow on a real phone — the maintainer may use one.

## Regression

Keep a short smoke suite (Playwright) covering: home loads, each section loads,
admin login, create+publish a news item, see it on the public page, delete it.
Run before every deploy.

See `prompts/qa-review.md` to run a structured QA pass and `prompts/accessibility-audit.md`
for the a11y audit.
