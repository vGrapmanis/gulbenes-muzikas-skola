-- ============================================================
-- program_documents — PDFs attached to Uzņemšana instruments
-- Each instrument can have one of each document_type PDF.
-- ============================================================
create table if not exists program_documents (
  id              uuid        primary key default gen_random_uuid(),
  instrument_name text        not null,
  document_type   text        not null check (
    document_type in ('izglitibas_programa', 'macibu_prieksmeta_programa')
  ),
  file_key        text        not null,
  file_size       int,
  created_at      timestamptz not null default now(),
  unique (instrument_name, document_type)
);

create index program_documents_instrument_idx on program_documents (instrument_name);

alter table program_documents enable row level security;

create policy "public read program documents"
  on program_documents for select to anon, authenticated
  using (true);

create policy "admin insert program documents"
  on program_documents for insert to authenticated
  with check (true);

create policy "admin update program documents"
  on program_documents for update to authenticated
  using (true) with check (true);

create policy "admin delete program documents"
  on program_documents for delete to authenticated
  using (true);
