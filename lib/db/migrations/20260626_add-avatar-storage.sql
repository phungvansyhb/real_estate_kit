-- ListingKit avatar storage
-- Mục tiêu:
-- 1) Tạo bucket công khai cho ảnh đại diện môi giới
-- 2) Chỉ cho phép user đã đăng nhập tải ảnh lên thư mục của chính họ

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar uploads are scoped to owner folder" on storage.objects;
create policy "Avatar uploads are scoped to owner folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
