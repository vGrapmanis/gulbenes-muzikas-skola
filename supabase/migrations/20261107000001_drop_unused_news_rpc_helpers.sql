-- create_news_item/update_news_item were a workaround for the PostgREST
-- schema cache not yet knowing about poster_portrait_key/poster_portrait_alt.
-- The admin actions now write those columns directly via a reloaded schema
-- cache, so these RPC helpers are unused.

drop function if exists create_news_item(text, text, date, text, text, text, text);
drop function if exists update_news_item(uuid, text, date, text, text, text, text);
