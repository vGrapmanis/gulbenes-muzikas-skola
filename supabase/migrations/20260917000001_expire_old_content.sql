-- Achievements and gallery albums (and their images) stop being visible to
-- the public 2 years after their effective date. The effective date is the
-- admin-set event_date when present, otherwise the row's created_at. Rows
-- are never deleted by this policy change — admins can still see and manage
-- expired rows via the "admin read all" policies and clean them up manually
-- from the admin panel.

-- ── achievements ─────────────────────────────────────────────────────────────
drop policy if exists "anon read published achievements" on achievements;
create policy "anon read published achievements"
  on achievements for select to anon
  using (
    published
    and coalesce(event_date, created_at::date) > (now() - interval '2 years')
  );

-- ── gallery_albums ───────────────────────────────────────────────────────────
drop policy if exists "anon read published albums" on gallery_albums;
create policy "anon read published albums"
  on gallery_albums for select to anon
  using (
    published
    and coalesce(event_date, created_at::date) > (now() - interval '2 years')
  );

-- ── gallery_images ───────────────────────────────────────────────────────────
-- images are readable only while their parent album is published and not expired
drop policy if exists "anon read album images" on gallery_images;
create policy "anon read album images"
  on gallery_images for select to anon
  using (
    exists (
      select 1 from gallery_albums a
      where a.id = gallery_images.album_id
        and a.published
        and coalesce(a.event_date, a.created_at::date) > (now() - interval '2 years')
    )
  );
