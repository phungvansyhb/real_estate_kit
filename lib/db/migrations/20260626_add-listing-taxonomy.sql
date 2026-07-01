-- ListingKit listing taxonomy update
-- Mục tiêu: hỗ trợ nhiều loại hình bất động sản, phân loại con,
-- nhu cầu bán/cho thuê, và nhóm điểm nổi bật riêng cho từng tin.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  avatar_url text,
  company text,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null default '',
  price bigint not null default 0 check (price >= 0),
  area numeric(12,2) not null default 0 check (area >= 0),
  bedrooms smallint,
  bathrooms smallint,
  address text not null,
  district text not null,
  city text not null,
  type text not null check (type in ('sell', 'rent')),
  property_type text not null check (property_type in ('apartment', 'house', 'land', 'villa', 'shophouse')),
  property_subtype text,
  amenities text[] not null default '{}',
  highlights text[] not null default '{}',
  images text[] not null default '{}',
  status text not null default 'draft' check (status in ('active', 'sold', 'rented', 'draft')),
  view_count integer not null default 0,
  leads_count integer not null default 0,
  source_breakdown jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_land_rooms_check check (
    property_type <> 'land' or (bedrooms is null and bathrooms is null)
  )
);

create index if not exists listings_user_id_idx on public.listings(user_id);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_property_type_idx on public.listings(property_type);
create index if not exists listings_type_idx on public.listings(type);
create index if not exists listings_featured_idx on public.listings(featured);
create index if not exists listings_created_at_idx on public.listings(created_at desc);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  name text not null,
  phone text not null,
  note text,
  preferred_time text,
  source text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.leads enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "listings_select_own" on public.listings;
create policy "listings_select_own"
  on public.listings
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own"
  on public.listings
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "listings_update_own" on public.listings;
create policy "listings_update_own"
  on public.listings
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "public_active_listings_read" on public.listings;
create policy "public_active_listings_read"
  on public.listings
  for select
  to anon, authenticated
  using (status = 'active');

drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.listings
      where listings.id = leads.listing_id
        and listings.status = 'active'
    )
  );

drop policy if exists "leads_select_own_listing" on public.leads;
create policy "leads_select_own_listing"
  on public.leads
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.listings
      where listings.id = leads.listing_id
        and listings.user_id = (select auth.uid())
    )
  );
