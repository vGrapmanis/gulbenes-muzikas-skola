# Prompt: Accessibility audit

Run a WCAG 2.1 AA audit against `docs/accessibility.md`. This is a public-sector
site, so AA is a legal requirement, not a nice-to-have. Automated tools find only
part of the issues — do the manual passes too.

## Procedure

1. **Automated:** run axe (e.g. `@axe-core/playwright`) and Lighthouse a11y on
   every public template (home, par-skolu, jaunumi + detail, sasniegumi, galerija +
   album, uznemsana, dokumenti, kontakti) and the admin login + one admin form.
   Record violations with severity and location.
2. **Keyboard only** (no mouse): tab through each page. Check skip link, logical
   order, visible focus (≥3:1), no traps, all controls operable. Specifically test
   the **gallery lightbox** (open/close on Esc, focus trap + restore, prev/next) and
   the **mobile nav menu**.
3. **Screen reader** (NVDA or VoiceOver) on home, a gallery album, the documents
   list, and an admin form: are images/labels/states announced sensibly? Are
   "opens in new tab" and downloads clear?
4. **Structure:** one `<h1>`/page, ordered headings, landmarks, lists as lists,
   `lang="lv"`, form labels + associated errors.
5. **Contrast:** spot-check text and UI/focus colors against the palette
   (`docs/design-system.md`); confirm no meaning conveyed by color alone.
6. **Zoom/reflow:** 200% zoom and 320px width — no loss of content or function, no
   horizontal scroll.
7. **Images:** every content image has meaningful Latvian alt; decorative images
   `alt=""`. Check a few real uploads, not just placeholders.
8. **PDFs:** sample documents — flag any scanned/untagged PDFs for the accessibility
   statement's "non-accessible content" list.

## Output

A findings table: WCAG criterion, severity, location, description, fix. Separate
**blockers** (must fix before launch) from improvements. Note anything that can't be
fully fixed (e.g. legacy PDFs) so it goes into the accessibility statement
(`docs/accessibility.md`). Re-run automated checks after fixes to confirm.
