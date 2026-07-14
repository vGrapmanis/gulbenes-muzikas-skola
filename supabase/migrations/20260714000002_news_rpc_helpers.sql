-- RPC helpers for news insert/update.
-- PostgREST resolves function signatures independently of its table schema cache,
-- so these calls succeed even before the cache refreshes after adding new columns.

create or replace function create_news_item(
  p_title              text,
  p_slug               text,
  p_event_date         date,
  p_poster_key         text,
  p_poster_alt         text,
  p_poster_portrait_key text,
  p_poster_portrait_alt text
) returns void
language plpgsql
security invoker
as $$
begin
  insert into news (
    title, slug, event_date,
    poster_key, poster_alt,
    poster_portrait_key, poster_portrait_alt,
    published
  ) values (
    p_title, p_slug, p_event_date,
    p_poster_key, p_poster_alt,
    p_poster_portrait_key, p_poster_portrait_alt,
    false
  );
end;
$$;

create or replace function update_news_item(
  p_id                 uuid,
  p_title              text,
  p_event_date         date,
  p_poster_key         text,
  p_poster_alt         text,
  p_poster_portrait_key text,
  p_poster_portrait_alt text
) returns void
language plpgsql
security invoker
as $$
begin
  update news set
    title                = p_title,
    event_date           = p_event_date,
    poster_key           = p_poster_key,
    poster_alt           = p_poster_alt,
    poster_portrait_key  = p_poster_portrait_key,
    poster_portrait_alt  = p_poster_portrait_alt,
    updated_at           = now()
  where id = p_id;
end;
$$;
