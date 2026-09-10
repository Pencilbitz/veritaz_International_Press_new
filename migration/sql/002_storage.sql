-- Supabase Storage setup — replaces Cloudinary for image/file uploads.
-- Run this after 001_schema.sql, also in the SQL Editor.

insert into storage.buckets (id, name, public)
values ('veritaz_media', 'veritaz_media', true)
on conflict (id) do nothing;

-- Public read (so image URLs work in the browser exactly like Cloudinary URLs did)
drop policy if exists "veritaz_media public read" on storage.objects;
create policy "veritaz_media public read" on storage.objects
  for select using (bucket_id = 'veritaz_media');

-- Only authenticated (admin) users can upload/replace/delete files
drop policy if exists "veritaz_media admin insert" on storage.objects;
create policy "veritaz_media admin insert" on storage.objects
  for insert with check (bucket_id = 'veritaz_media' and auth.role() = 'authenticated');

drop policy if exists "veritaz_media admin update" on storage.objects;
create policy "veritaz_media admin update" on storage.objects
  for update using (bucket_id = 'veritaz_media' and auth.role() = 'authenticated');

drop policy if exists "veritaz_media admin delete" on storage.objects;
create policy "veritaz_media admin delete" on storage.objects
  for delete using (bucket_id = 'veritaz_media' and auth.role() = 'authenticated');
