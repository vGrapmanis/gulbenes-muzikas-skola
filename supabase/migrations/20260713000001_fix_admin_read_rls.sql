-- The initial RLS setup restricted authenticated users to published rows only,
-- which breaks the admin who needs to read ALL rows (draft + published).
-- Fix: split into separate policies for anon vs authenticated.

-- ── graduates ──────────────────────────────────────────────────────────────
drop policy if exists "public read published graduates" on graduates;
create policy "anon read published graduates"
  on graduates for select to anon using (published);
create policy "admin read all graduates"
  on graduates for select to authenticated using (true);

-- ── news ───────────────────────────────────────────────────────────────────
drop policy if exists "public read published news" on news;
create policy "anon read published news"
  on news for select to anon using (published);
create policy "admin read all news"
  on news for select to authenticated using (true);

-- ── achievements ───────────────────────────────────────────────────────────
drop policy if exists "public read published achievements" on achievements;
create policy "anon read published achievements"
  on achievements for select to anon using (published);
create policy "admin read all achievements"
  on achievements for select to authenticated using (true);

-- ── gallery_albums ─────────────────────────────────────────────────────────
drop policy if exists "public read published albums" on gallery_albums;
create policy "anon read published albums"
  on gallery_albums for select to anon using (published);
create policy "admin read all albums"
  on gallery_albums for select to authenticated using (true);

-- ── gallery_images ─────────────────────────────────────────────────────────
drop policy if exists "public read album images" on gallery_images;
create policy "anon read album images"
  on gallery_images for select to anon
  using (
    exists (
      select 1 from gallery_albums a
      where a.id = gallery_images.album_id and a.published
    )
  );
create policy "admin read all gallery images"
  on gallery_images for select to authenticated using (true);

-- ── documents ──────────────────────────────────────────────────────────────
drop policy if exists "public read published documents" on documents;
create policy "anon read published documents"
  on documents for select to anon using (published);
create policy "admin read all documents"
  on documents for select to authenticated using (true);
