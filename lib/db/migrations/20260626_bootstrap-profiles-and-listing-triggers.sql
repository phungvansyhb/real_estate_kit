-- ListingKit auth/profile bootstrap + listing maintenance
-- Mục tiêu:
-- 1) Tự tạo row trong public.profiles khi user đăng ký qua Supabase Auth
-- 2) Backfill profile cho các auth user đã tồn tại
-- 3) Tự cập nhật updated_at cho listings khi có thay đổi
-- 4) Bổ sung index/policy cần thiết cho flow hiện tại

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

create or replace function public.bootstrap_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fallback_name text;
begin
  fallback_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Môi giới mới'
  );

  insert into public.profiles (
    id,
    name,
    phone,
    email,
    avatar_url,
    company,
    plan
  )
  values (
    new.id,
    fallback_name,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'company'), ''),
    'free'
  )
  on conflict (id) do update
  set
    email = coalesce(excluded.email, profiles.email),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    phone = coalesce(excluded.phone, profiles.phone),
    company = coalesce(excluded.company, profiles.company),
    name = case
      when coalesce(trim(profiles.name), '') = '' then excluded.name
      else profiles.name
    end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.bootstrap_profile_from_auth_user();

insert into public.profiles (
  id,
  name,
  phone,
  email,
  avatar_url,
  company,
  plan
)
select
  users.id,
  coalesce(
    nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(users.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
    'Môi giới mới'
  ) as name,
  nullif(trim(users.raw_user_meta_data ->> 'phone'), '') as phone,
  users.email,
  nullif(trim(users.raw_user_meta_data ->> 'avatar_url'), '') as avatar_url,
  nullif(trim(users.raw_user_meta_data ->> 'company'), '') as company,
  'free' as plan
from auth.users as users
left join public.profiles as profiles
  on profiles.id = users.id
where profiles.id is null;

create index if not exists leads_listing_id_idx on public.leads(listing_id);
create index if not exists profiles_email_idx on public.profiles(email);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);
