-- ============================================================
-- Remove the Absolventi sub-section (dropped from Par skolu).
-- `graduates` was the originally specced per-year graduate list;
-- `graduate_classes` (never migration-tracked — created ad hoc)
-- backed the photo-per-izlaidums gallery that actually shipped.
-- Drop both; their RLS policies and indexes go with the tables.
-- ============================================================
drop table if exists graduates cascade;
drop table if exists graduate_classes cascade;
