# Prompt: Optimize the codebase

A focused pass to improve performance, maintainability, and bundle size **without
changing behavior or breaking the constraints in `CLAUDE.md`**.

## Rules

- Do **not** change the stack, the data model, or public behavior unless the task
  explicitly asks.
- Respect the golden rules: no images in the DB; Node runtime only (no Edge); keep
  the Worker ≤ 3 MiB gzipped; RLS intact; monochrome brand.
- Make small, reviewable commits, each with a clear rationale. Re-run
  `lint`, `typecheck`, `test`, `build` after each.
- Measure before/after (bundle size, Lighthouse) and report the delta.

## Checklist

**Bundle / Worker size**
- [ ] Find the largest server-side dependencies; dynamic-import or remove them.
- [ ] Ensure heavy image processing isn't bundled into the Worker (do it
      client-side or via Cloudflare image resizing).
- [ ] Trim unused deps, locales, and dead code; check tree-shaking.
- [ ] Confirm `wrangler` reports a comfortable margin under 3 MiB gzipped.

**Rendering / data**
- [ ] Verify each public page uses the right strategy (static/ISR) and isn't
      accidentally dynamic; confirm on-demand revalidation fires on admin writes.
- [ ] Remove redundant Supabase queries; select only needed columns; add indexes
      for common filters/sorts (published, dates, slug, album_id).
- [ ] Cache where safe; avoid waterfalls.

**Images**
- [ ] Responsive sizes + lazy loading + explicit dimensions everywhere (no CLS).
- [ ] WebP/AVIF served; reasonable compression; no oversized originals shipped.

**Code quality**
- [ ] De-duplicate components; ensure cards/forms/section wrappers are reused, not
      re-styled per page.
- [ ] Strengthen types (no stray `any`); regenerate Supabase types if drifted.
- [ ] Tidy server actions: validation, error handling, and `requireAdmin()` are
      consistent.

**Accessibility & SEO (don't regress)**
- [ ] Re-run axe + Lighthouse; ensure no regressions vs. baseline.

## Output

A summary of changes, the measured before/after (bundle size + Lighthouse on home,
a gallery album, and the documents page), and any follow-ups too risky to bundle
into this pass.
