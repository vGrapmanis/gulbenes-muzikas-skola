-- ============================================================
-- Enable Row Level Security on every content table
-- ============================================================
alter table pages           enable row level security;
alter table graduates       enable row level security;
alter table news            enable row level security;
alter table achievements    enable row level security;
alter table gallery_albums  enable row level security;
alter table gallery_images  enable row level security;
alter table documents       enable row level security;


-- ============================================================
-- PUBLIC READ policies
-- anon key is safe to expose because RLS limits it to
-- published rows (or always-readable rows like pages).
-- ============================================================

-- pages are always public (no published toggle)
create policy "public read pages"
  on pages for select to anon, authenticated
  using (true);

create policy "public read published graduates"
  on graduates for select to anon, authenticated
  using (published);

create policy "public read published news"
  on news for select to anon, authenticated
  using (published);

create policy "public read published achievements"
  on achievements for select to anon, authenticated
  using (published);

create policy "public read published albums"
  on gallery_albums for select to anon, authenticated
  using (published);

-- gallery_images are readable only when their parent album is published
create policy "public read album images"
  on gallery_images for select to anon, authenticated
  using (
    exists (
      select 1 from gallery_albums a
      where a.id = gallery_images.album_id
        and a.published
    )
  );

create policy "public read published documents"
  on documents for select to anon, authenticated
  using (published);


-- ============================================================
-- ADMIN WRITE policies
-- Any authenticated user is the admin (single-account model;
-- public sign-up is disabled in Supabase Auth settings).
-- ============================================================

-- pages (no insert / delete — singletons managed by seed)
create policy "admin update pages"
  on pages for update to authenticated
  using (true) with check (true);

-- graduates
create policy "admin insert graduates"
  on graduates for insert to authenticated
  with check (true);
create policy "admin update graduates"
  on graduates for update to authenticated
  using (true) with check (true);
create policy "admin delete graduates"
  on graduates for delete to authenticated
  using (true);

-- news
create policy "admin insert news"
  on news for insert to authenticated
  with check (true);
create policy "admin update news"
  on news for update to authenticated
  using (true) with check (true);
create policy "admin delete news"
  on news for delete to authenticated
  using (true);

-- achievements
create policy "admin insert achievements"
  on achievements for insert to authenticated
  with check (true);
create policy "admin update achievements"
  on achievements for update to authenticated
  using (true) with check (true);
create policy "admin delete achievements"
  on achievements for delete to authenticated
  using (true);

-- gallery_albums
create policy "admin insert gallery_albums"
  on gallery_albums for insert to authenticated
  with check (true);
create policy "admin update gallery_albums"
  on gallery_albums for update to authenticated
  using (true) with check (true);
create policy "admin delete gallery_albums"
  on gallery_albums for delete to authenticated
  using (true);

-- gallery_images
create policy "admin insert gallery_images"
  on gallery_images for insert to authenticated
  with check (true);
create policy "admin update gallery_images"
  on gallery_images for update to authenticated
  using (true) with check (true);
create policy "admin delete gallery_images"
  on gallery_images for delete to authenticated
  using (true);

-- documents
create policy "admin insert documents"
  on documents for insert to authenticated
  with check (true);
create policy "admin update documents"
  on documents for update to authenticated
  using (true) with check (true);
create policy "admin delete documents"
  on documents for delete to authenticated
  using (true);
