# Design system

The brand is **near-monochrome and high-contrast**: a dark ink, true black, off-white
"paper", a neutral gray scale, and the **piano-key graphic** as the main accent.
Content, logo, and text stay strictly monochrome. The one permitted splash of color
is a **subtle, translucent decorative gradient** used only in *background* accents
(the vertical "piano-key" bars on the home hero edges) — never on text, the logo, or
UI controls, and never strong enough to affect contrast. Restraint is the aesthetic.

All values below were sampled from the official brand files supplied by the school
(in the project assets folder).

## Color tokens

```css
:root {
  /* Brand core */
  --color-ink:    #201820; /* primary dark — logo, headings, body text on light */
  --color-black:  #000000; /* hero / footer / high-contrast section backgrounds */
  --color-paper:  #F8F8F8; /* light background; text color on dark surfaces */
  --color-white:  #FFFFFF;

  /* Neutral gray scale (decorative piano keys + UI chrome) */
  --color-gray-100: #F0F0F0;
  --color-gray-300: #D0D0D0;
  --color-gray-400: #B0B0B0;
  --color-gray-500: #A0A0A0;
  --color-gray-700: #404040;
  --color-gray-900: #1A1A1A;

  /* Semantic */
  --color-bg:           var(--color-paper);
  --color-fg:           var(--color-ink);
  --color-bg-inverse:   var(--color-black);
  --color-fg-inverse:   var(--color-paper);
  --color-border:       var(--color-gray-300);
  --color-muted:        var(--color-gray-700);

  /* Functional (admin/forms only — keep subtle) */
  --color-focus:   #2D6CDF; /* visible focus ring; must pass 3:1 against bg */
  --color-success: #1E7E34;
  --color-danger:  #B3261E;
}
```

Map these into `tailwind.config.ts` under `theme.extend.colors`. Components should
reference semantic tokens (`bg`, `fg`, `border`) rather than raw hex, so light/dark
sections stay consistent.

### Contrast

- Ink on paper and paper on black both exceed WCAG AA for normal text. Verify any
  new combination with a contrast checker (target **4.5:1** body, **3:1** large
  text and UI components). Mid grays (`gray-400/500`) are **decorative only** —
  never use them for text on white.

## Typography

The wordmark is a clean geometric sans. Use free, Latvian-complete fonts:

- **Headings:** a geometric grotesque — `Manrope` or `Sora` (Google Fonts).
- **Body / UI:** `Inter` (Google Fonts) — full Latin Extended, robust diacritics.

Self-host via `next/font` (no external request, better privacy + performance).
**Verify Latvian glyph coverage** (ā ē ī ū ō č ģ ķ ļ ņ ŗ š ž) before committing a
font — render a test string in every weight used.

```
Type scale (rem):  0.875 · 1 · 1.125 · 1.25 · 1.5 · 2 · 2.5 · 3.25
Line height:       body 1.6 · headings 1.15
Weights:           400 / 500 / 700 (avoid loading more)
```

## Spacing & layout

```
Spacing scale (px): 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96
Container max-width: 1200px, centered, 16px gutters (24px ≥ md)
Radius: 0 (sharp) for sections; 8px for cards/buttons; pill for the badge logo
Grid: 12-col on desktop; cards collapse to 1–2 cols on mobile
```

Generous whitespace, strong typographic hierarchy, full-bleed black hero echoing
the logo lockups. The piano-key fan graphic can be used as a section divider or
hero accent — sparingly.

## Brand assets

Official files supplied by the school (square = icon/avatar, tall = vertical mark,
badge = rounded-rectangle lockup, horizontal = full "Gulbenes Mūzikas Skola"
lockup, plus a decorative piano-key fan). Each exists in a **dark (`#201820`)**
and a **light (`#F8F8F8`)** variant for use on light vs. dark backgrounds.

Recommended repo layout (convert to SVG where possible for crispness; keep PNG
fallbacks):

```
/public/brand/
  logo-vertical-dark.svg        logo-vertical-light.svg
  logo-badge-dark.svg           logo-badge-light.svg
  logo-horizontal-dark.svg      logo-horizontal-light.svg   (full name lockup)
  icon-square.svg               (app icon / social avatar)
  piano-keys.svg                (decorative fan accent)
  favicon.ico  apple-touch-icon.png  icon-192.png  icon-512.png
```

Usage rules:

- Pick the variant by background: **dark logo on light**, **light logo on dark**.
- Never recolor the logo into a non-brand color, stretch it, or add effects.
- Maintain clear space around the logo equal to the height of the "G".
- Header uses the horizontal lockup (or icon + wordmark); footer uses the light
  variant on the black background.

## Home hero & header (reference: school screenshot)

- **Header:** dark (near-black, `--color-gray-900` / `--color-black`) bar; light
  horizontal logo lockup at left; right-aligned nav. Nav items **uppercase, white,
  letter-spaced (~0.05em)**, with a chevron (▾) on dropdown items ("Par skolu",
  "Informācija"). Sticky on scroll. Mobile collapses to a hamburger menu.
- **Hero:** near-black background, one full screen, centered column — uppercase white
  title, then the large grayscale piano-key fan graphic, then the white bold motto
  with stylized quotes and the `/Ojārs Vācietis/` attribution. Calm and spacious.
- **Decorative edge bars:** translucent vertical strips at the far left/right of the
  hero with faint amber/teal/red gradients, evoking piano keys. **Decorative only:**
  low opacity, `aria-hidden="true"`, rendered behind content; must never drop text
  contrast below AA. This is the *only* place color appears.

## Components (minimum set)

Header/nav (sticky, mobile hamburger), footer, hero, section wrapper (light/dark
variants), card (used for news, achievements, album covers),
album lightbox/grid, document list row (view + download), breadcrumb, button
(primary/secondary/ghost), tag/badge, pagination, cookie-consent banner, and the
admin form primitives. Keep them in `components/`, documented and reused — do not
re-style per page.
