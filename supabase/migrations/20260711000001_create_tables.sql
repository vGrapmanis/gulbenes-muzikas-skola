-- ============================================================
-- Trigger function: keep updated_at current on every UPDATE
-- ============================================================
create or replace function handle_updated_at()
returns trigger language plpgsql security definer as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- pages — singleton editable text blocks
-- (home_hero, about_history, admissions, contacts)
-- Admin can only EDIT these rows; they are never created or
-- deleted through the UI.
-- ============================================================
create table if not exists pages (
  id         uuid        primary key default gen_random_uuid(),
  slug       text        unique not null,
  title      text,
  body       text,
  updated_at timestamptz not null default now()
);

create trigger pages_updated_at
  before update on pages
  for each row execute procedure handle_updated_at();


-- ============================================================
-- graduates — Absolventi (one row per graduate)
-- Public UI groups rows by year into cards.
-- ============================================================
create table if not exists graduates (
  id            uuid        primary key default gen_random_uuid(),
  year          int         not null,
  full_name     text        not null,
  program       text,
  teacher       text,
  display_order int         not null default 0,
  published     boolean     not null default false,
  created_at    timestamptz not null default now()
);

create index graduates_year_idx      on graduates (year desc);
create index graduates_published_idx on graduates (published);


-- ============================================================
-- news — Jaunumi (concert / event posters)
-- poster_key and poster_alt are required for every item.
-- ============================================================
create table if not exists news (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        unique not null,
  body         text,
  poster_key   text        not null,
  poster_alt   text        not null,
  event_date   date,
  published    boolean     not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger news_updated_at
  before update on news
  for each row execute procedure handle_updated_at();

create index news_published_idx   on news (published);
create index news_event_date_idx  on news (event_date desc nulls last);


-- ============================================================
-- achievements — Sasniegumi (competition results)
-- image_alt is required whenever image_key is set (enforced
-- in the application layer, not here, to keep the check simple).
-- ============================================================
create table if not exists achievements (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  student_name  text        not null,
  competition   text,
  result        text,
  description   text,
  event_date    date,
  image_key     text,
  image_alt     text,
  display_order int         not null default 0,
  published     boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger achievements_updated_at
  before update on achievements
  for each row execute procedure handle_updated_at();

create index achievements_published_idx  on achievements (published);
create index achievements_event_date_idx on achievements (event_date desc nulls last);
create index achievements_order_idx      on achievements (display_order);


-- ============================================================
-- gallery_albums — Galerija (album metadata)
-- ============================================================
create table if not exists gallery_albums (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  slug        text        unique not null,
  description text,
  cover_key   text,
  event_date  date,
  published   boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger gallery_albums_updated_at
  before update on gallery_albums
  for each row execute procedure handle_updated_at();

create index gallery_albums_published_idx  on gallery_albums (published);
create index gallery_albums_event_date_idx on gallery_albums (event_date desc nulls last);


-- ============================================================
-- gallery_images — images within an album
-- Cascade-deletes when the parent album is removed.
-- alt must always be set (empty string is allowed only for
-- purely decorative images, which should be rare in a gallery).
-- ============================================================
create table if not exists gallery_images (
  id            uuid        primary key default gen_random_uuid(),
  album_id      uuid        not null references gallery_albums (id) on delete cascade,
  image_key     text        not null,
  caption       text,
  alt           text        not null default '',
  display_order int         not null default 0,
  created_at    timestamptz not null default now()
);

create index gallery_images_album_order_idx on gallery_images (album_id, display_order);


-- ============================================================
-- documents — Dokumenti (PDFs served from R2)
-- file_key is the R2 object key; file_size is bytes (optional,
-- for display only).
-- ============================================================
create table if not exists documents (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  description   text,
  category      text,
  file_key      text        not null,
  file_size     int,
  display_order int         not null default 0,
  published     boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger documents_updated_at
  before update on documents
  for each row execute procedure handle_updated_at();

create index documents_published_idx     on documents (published);
create index documents_category_idx      on documents (category);
create index documents_display_order_idx on documents (display_order);
