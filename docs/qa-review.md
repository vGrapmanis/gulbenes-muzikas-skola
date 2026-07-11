# Prompt: Run a QA pass

Execute a structured QA review against `docs/testing-qa.md` and report findings.
Don't just assert "looks good" — actually run the checks and show evidence.

## Scope

State what you're testing (a feature, a section, or the whole site) and the
environment (local / preview / production-like).

## Procedure

1. **Static:** run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Paste
   results. Fix or file each failure.
2. **Functional (public):** walk the relevant rows of the public test matrix in
   `docs/testing-qa.md`. For each: state expected vs. actual. Pay attention to:
   - only `published` content visible when logged out,
   - Latvian diacritics intact (titles, slugs, search, metadata),
   - empty states, 404/error pages, pagination, newest-first ordering.
3. **Functional (admin):** login/logout, `/admin` gated when logged out, CRUD for
   each type, upload writes to R2, **delete removes the R2 object**, publish toggle
   reflects immediately, server-side validation messages (Latvian).
4. **Security:** confirm `service_role` isn't in the client bundle; verify RLS with
   the anon key (can't read drafts, can't write); external links `rel="noopener"`.
5. **Accessibility:** run axe + a keyboard pass on the touched pages; gallery
   lightbox and forms specifically. (Full audit → `prompts/accessibility-audit.md`.)
6. **Performance:** Lighthouse on home, a gallery album, and the documents page;
   report scores and Core Web Vitals; confirm Worker ≤ 3 MiB gzipped.
7. **Cross-device:** at least one mobile pass (gallery + admin upload).

## Report format

For each finding: **severity** (blocker / major / minor / nit), where it is, steps
to reproduce, expected vs. actual, and a suggested fix. End with a go/no-go
recommendation and the list of blockers that must be fixed before deploy.
