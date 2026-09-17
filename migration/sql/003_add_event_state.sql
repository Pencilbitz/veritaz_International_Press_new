-- Adds a "state" column to veritaz_events (e.g. "Tamil Nadu", "Karnataka"),
-- separate from the free-text `location` field. Run once in the Supabase SQL Editor.
alter table public.veritaz_events add column if not exists state text;
