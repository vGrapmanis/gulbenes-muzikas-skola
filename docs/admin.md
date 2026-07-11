# Admin

A single shared admin account manages all dynamic content. The admin is
**non-technical and Latvian-speaking** — the UI, labels, and errors are all in
Latvian and should be self-explanatory.

## Authentication

- **Supabase Auth**, email + password, **one shared account** created manually in
  the Supabase dashboard (no public sign-up — disable sign-ups).
- Login page at `/admin/pieslegties`. On success, redirect to `/admin`.
- Session via Supabase cookies. **Verify the session server-side** in every admin
  route/action (server component or route handler). Remember: `cookies()` is
  Node-only and middleware on Workers can't use it — so do not rely on
  `middleware.ts` for auth gating; gate inside the server components/actions of the
  `/admin` segment (e.g. a shared `requireAdmin()` server helper that redirects to
  login when there's no valid session).
- Provide a logout action. Provide password reset via Supabase email.
- Rate-limit login attempts. Never reveal whether the email or the password was
  wrong ("Nepareizs e-pasts vai parole").

> Single-admin means **any authenticated user = admin** in RLS. Because public
> sign-up is disabled and only the school's account exists, this is safe. If the
> school later wants multiple editors or roles, introduce a `profiles` table with a
> `role` column and tighten RLS — leave a note, don't over-build now.

## What the admin can manage

| Section        | Create | Edit | Delete | Publish toggle |
| -------------- | :----: | :--: | :----: | :------------: |
| Pages (texts)  |   —    |  ✅  |   —    |       —        |
| Absolventi     |  ✅   |  ✅  |  ✅   |      ✅        |
| Jaunumi        |  ✅   |  ✅  |  ✅   |      ✅        |
| Sasniegumi     |  ✅   |  ✅  |  ✅   |      ✅        |
| Galerija (album)| ✅   |  ✅  |  ✅   |      ✅        |
| Galerija (image)| ✅   |  ✅  |  ✅   |       —        |
| Dokumenti      |  ✅   |  ✅  |  ✅   |      ✅        |

"Pages" (home hero, history, admissions, contacts) are edit-only — they always
exist and are always shown.

## Admin layout

```
/admin                      dashboard: counts + quick links + recent items
/admin/pieslegties          login
/admin/lapas                edit page texts (home hero, history, admissions, contacts)
/admin/absolventi           list + add/edit graduates (grouped by year)
/admin/jaunumi              list + add/edit news (poster upload)
/admin/sasniegumi           list + add/edit achievements (photo upload)
/admin/galerija             list albums → /admin/galerija/[id] manage images
/admin/dokumenti            list + add/edit documents (PDF upload)
```

## Content workflows

### Upload (news / achievements / gallery / documents)
1. Admin fills the form (Latvian fields) and selects a file.
2. **Client-side**: validate type + size; for images, optionally downscale/convert
   to WebP before upload (keeps the Worker light).
3. Submit to a server action → `requireAdmin()` → write file to R2 (binding) →
   insert/update the row with the R2 key + admin-provided **alt text** (required
   for content images) → `revalidatePath` the affected public route.
4. Show success/error in Latvian; never lose the admin's input on error.

### Graduates
- Add one graduate at a time: **gads** (year), **vārds uzvārds**, optional
  **programma** and **pedagogs**. The public page groups by year into cards.
- Offer a "kopēt no iepriekšējā gada" convenience only if it's genuinely useful.

### Gallery
- Create the **album** first (title, date, cover). Then open the album and
  **bulk-upload** images (multi-select, with progress). Allow reorder
  (`display_order`) and per-image alt/caption. Set/replace the cover from any image.

### Delete
- Always confirm (Latvian modal). On delete, remove the DB row **and** the R2
  object(s). Deleting an album cascades to its images and their R2 objects.

## Validation & UX rules

- Required fields enforced **server-side** (don't trust the client).
- File limits enforced server-side (e.g. images ≤ 8 MB, PDFs ≤ 20 MB — tune as
  needed) with a clear Latvian message on rejection.
- Slugs auto-generated from the title; keep them stable after publish (changing a
  published slug breaks links — warn before doing so).
- Autosave or "draft" (`published = false`) so the admin can prepare content and
  publish later.
- Every list view: search/filter, pagination, and a clear published/draft badge.
- Generous touch targets and large readable controls (the maintainer may use a
  phone or tablet).

## Security

- No public sign-up; one account; strong password stored only in Supabase.
- All writes behind `requireAdmin()` + RLS (defense in depth).
- `service_role` key used only in trusted server contexts, never sent to the
  client.
- CSRF: use framework-native protections for server actions; same-site cookies.
- Log admin actions minimally (who/when/what) if the school wants an audit trail —
  optional, GDPR-minimal.
