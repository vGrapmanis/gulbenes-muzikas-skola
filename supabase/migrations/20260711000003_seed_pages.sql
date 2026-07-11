-- ============================================================
-- Singleton page rows
-- The admin can only EDIT these; they are never created or
-- deleted through the UI. Insert here so they always exist.
-- on conflict do nothing is safe for re-runs (e.g. db reset).
-- ============================================================
insert into pages (slug, title, body) values
  ('home_hero',     'Gulbenes Mūzikas Skola', null),
  ('about_history', 'Vēsture',                null),
  ('admissions',    'Uzņemšana',              null),
  ('contacts',      'Kontakti',               null)
on conflict (slug) do nothing;
