-- ListingKit profile bio + public agent projection
-- Mục tiêu:
-- 1) Cho phép môi giới thêm phần giới thiệu công khai ngắn
-- 2) Tạo view public chỉ lộ các field cần thiết cho trang tin công khai

alter table public.profiles
  add column if not exists bio text;

alter table public.profiles
  drop constraint if exists profiles_bio_length_check;

alter table public.profiles
  add constraint profiles_bio_length_check
  check (bio is null or char_length(bio) <= 512);

create or replace view public.public_agent_profiles as
select
  profiles.id,
  profiles.name,
  profiles.phone,
  profiles.avatar_url,
  profiles.company,
  profiles.bio,
  profiles.plan
from public.profiles;

grant select on public.public_agent_profiles to anon, authenticated;
