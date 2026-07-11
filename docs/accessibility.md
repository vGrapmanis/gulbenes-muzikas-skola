# Accessibility

This is a Latvian **public-sector** website. Under the EU Web Accessibility
Directive (transposed into Latvian law), it must meet **WCAG 2.1 level AA** and
publish an **accessibility statement** (pieejamības paziņojums). Treat the items
below as acceptance criteria — a feature isn't done until it passes them.

## Core requirements (WCAG 2.1 AA, condensed)

**Perceivable**
- [ ] Every content image has meaningful Latvian `alt`; decorative images use
      `alt=""`. Admin-entered alt is required for content images.
- [ ] Text contrast ≥ **4.5:1** (normal) / **3:1** (large text, UI components,
      focus indicators). Mid-grays are decorative only.
- [ ] Don't rely on color alone to convey meaning (e.g. published/draft also has
      text/icon, not just color).
- [ ] Content reflows to 320px width without horizontal scrolling; works at 200%
      zoom.
- [ ] PDFs in Dokumenti should be reasonably accessible (tagged, real text not
      scanned images where possible); note exceptions in the statement.

**Operable**
- [ ] Full keyboard operability: nav, menus, gallery lightbox, admin forms — all
      reachable and usable with keyboard only; no traps.
- [ ] Visible focus indicator on every interactive element (≥ 3:1).
- [ ] Logical focus order; skip-to-content link at the top of each page.
- [ ] Touch targets comfortably large (≈44×44px).
- [ ] No content that flashes more than 3×/second.

**Understandable**
- [ ] `<html lang="lv">` set site-wide.
- [ ] Consistent navigation and naming across pages.
- [ ] Form fields have visible `<label>`s; errors are described in text, associated
      with the field, and announced; instructions are clear (Latvian).

**Robust**
- [ ] Semantic HTML: one `<h1>` per page, ordered headings, landmarks
      (`header`/`nav`/`main`/`footer`), lists for lists.
- [ ] Interactive widgets (menu, lightbox, modals) use correct ARIA roles/states
      and are tested with a screen reader.
- [ ] Valid, well-formed markup.

## Section-specific notes

- **Gallery lightbox:** must trap focus while open, close on `Esc`, restore focus
  to the trigger, expose prev/next as real buttons with labels, and announce image
  position.
- **Documents:** "Skatīt" opens in a new tab — warn (e.g. visually-hidden text
  "(atveras jaunā cilnē)"); "Lejupielādēt" is a real download.
- **News/Achievements cards:** the whole card may be clickable, but ensure a real
  focusable link with an accessible name (not just a clickable div).
- **Cookie banner:** keyboard accessible, doesn't trap focus, "decline" is as easy
  as "accept".

## Tooling

- Automated: `axe-core` / `@axe-core/playwright`, Lighthouse a11y, `eslint-plugin-jsx-a11y`.
- Manual: keyboard-only pass, screen reader pass (NVDA/VoiceOver), 200% zoom,
  contrast spot-checks. Automated tools catch ~⅓ of issues — manual passes are
  required, not optional. See `prompts/accessibility-audit.md`.

## Accessibility statement (template — fill in, publish at `/pieejamiba`)

> **Pieejamības paziņojums**
>
> Gulbenes Mūzikas skola apņemas savu tīmekļvietni padarīt pieejamu saskaņā ar
> [piemērojamo normatīvo aktu]. Šis paziņojums attiecas uz `gulbenesms.lv`.
>
> **Atbilstības statuss:** [pilnībā / daļēji atbilst] WCAG 2.1 AA līmenim.
>
> **Nepieejamais saturs:** [uzskaitīt zināmās problēmas, piem., atsevišķi vecāki
> PDF dokumenti var nebūt pilnībā pieejami].
>
> **Paziņojuma sagatavošana:** šis paziņojums sagatavots [datums], pamatojoties uz
> [pašnovērtējumu / auditu].
>
> **Atsauksmes un kontaktinformācija:** ja konstatējat pieejamības problēmu,
> rakstiet [e-pasts] vai zvaniet [tālrunis]. Atbildi sniegsim [termiņš] laikā.
>
> **Izpildes procedūra:** ja neesat apmierināts ar atbildi, varat vērsties
> [atbildīgā uzraudzības iestāde].

Get the exact legal references and the responsible-body wording from the school /
municipality before publishing (see `docs/content-checklist.md`).
