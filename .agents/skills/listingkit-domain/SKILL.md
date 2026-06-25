---
name: listingkit-domain
description: >
  Kiến thức domain của ListingKit: schema database, business rules, slug generation,
  AI mô tả, QR code, pricing tiers, và Stripe integration. Dùng khi cần implement
  logic nghiệp vụ đặc thù của ứng dụng bất động sản này.
---

# ListingKit Domain Knowledge

## Database Schema

```sql
-- Người dùng (môi giới)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz default now()
);

-- Listing bất động sản
create table listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  slug text unique not null,             -- URL-friendly identifier
  title text not null,
  description text,
  price bigint,                          -- Giá tính bằng VND
  area numeric,                          -- Diện tích m²
  bedrooms smallint,
  bathrooms smallint,
  address text not null,
  lat numeric,
  lng numeric,
  type text check (type in ('sell', 'rent')),
  property_type text check (property_type in ('apartment', 'house', 'land', 'villa', 'shophouse')),
  amenities text[] default '{}',
  images text[] default '{}',            -- Mảng public URLs
  status text not null default 'active' check (status in ('active', 'sold', 'rented', 'draft')),
  view_count int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads từ khách hàng
create table leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  name text not null,
  phone text not null,
  note text,
  preferred_time text,
  source text,                           -- 'zalo', 'facebook', 'qr', 'direct'
  created_at timestamptz default now()
);
```

## Pricing & Plan limits

```ts
// src/lib/plans.ts
export const PLAN_LIMITS = {
  free:    { maxListings: 3,  aiDescription: false, customDomain: false },
  starter: { maxListings: 20, aiDescription: true,  customDomain: false },
  pro:     { maxListings: Infinity, aiDescription: true, customDomain: true },
} as const

export type Plan = keyof typeof PLAN_LIMITS

export function canCreateListing(plan: Plan, currentCount: number): boolean {
  return currentCount < PLAN_LIMITS[plan].maxListings
}
```

## Slug generation

```ts
// src/lib/slug.ts
import { createServerClient } from '@/lib/supabase/server'

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // bỏ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const supabase = await createServerClient()
  let slug = baseSlug
  let attempt = 0

  while (true) {
    const { data } = await supabase
      .from('listings')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!data) return slug
    slug = `${baseSlug}-${++attempt}`
  }
}
```

## AI mô tả (OpenAI)

```ts
// src/lib/ai/generate-description.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface ListingInfo {
  title: string
  price?: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  address: string
  amenities?: string[]
  type: 'sell' | 'rent'
}

export async function generateListingDescription(info: ListingInfo): Promise<string> {
  const prompt = `Viết đoạn mô tả hấp dẫn cho bất động sản sau bằng tiếng Việt, khoảng 150-200 từ, tập trung vào điểm nổi bật và lợi ích cho người mua/thuê:

Tên: ${info.title}
Loại: ${info.type === 'sell' ? 'Bán' : 'Cho thuê'}
Giá: ${info.price ? new Intl.NumberFormat('vi-VN').format(info.price) + ' VND' : 'Thỏa thuận'}
Diện tích: ${info.area ?? '?'} m²
Phòng ngủ: ${info.bedrooms ?? '?'} | Phòng tắm: ${info.bathrooms ?? '?'}
Địa chỉ: ${info.address}
Tiện ích: ${info.amenities?.join(', ') ?? 'Không có thông tin'}

Chỉ trả về đoạn mô tả, không có tiêu đề hay giải thích thêm.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.7,
  })

  return completion.choices[0].message.content ?? ''
}
```

## QR Code generation

```ts
// src/lib/qrcode.ts
import QRCode from 'qrcode'

export async function generateQRCode(slug: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/l/${slug}`
  // Trả về data URL (PNG base64) để download
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
  })
}
```

## Stripe webhook handler

```ts
// src/app/api/webhooks/stripe/route.ts
// Xử lý: checkout.session.completed, customer.subscription.updated/deleted
// Sau mỗi event: update profiles.plan tương ứng

const PLAN_BY_PRICE_ID: Record<string, 'starter' | 'pro'> = {
  [process.env.STRIPE_STARTER_PRICE_ID!]: 'starter',
  [process.env.STRIPE_PRO_PRICE_ID!]: 'pro',
}
```

## Pricing tiers (Stripe Price IDs)

```
STRIPE_STARTER_PRICE_ID=price_xxx  → $19/tháng
STRIPE_PRO_PRICE_ID=price_xxx      → $49/tháng
```
