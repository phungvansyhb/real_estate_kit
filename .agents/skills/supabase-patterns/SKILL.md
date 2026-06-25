---
name: supabase-patterns
description: >
  Khi làm việc với Supabase: tạo client, query database, upload ảnh lên Storage,
  xử lý auth, hoặc viết RLS policy. Dùng khi cần pattern chuẩn để tránh lỗi
  security và type-safety.
---

# Supabase Patterns — ListingKit

## Client setup (Next.js App Router)

```ts
// src/lib/supabase/server.ts — dùng trong Server Component & API Route
import { createServerClient as _createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createServerClient() {
  const cookieStore = await cookies()
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

```ts
// src/lib/supabase/client.ts — chỉ dùng trong Client Component
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Query patterns

```ts
// ✅ Luôn destructure và xử lý error trước
const { data: listing, error } = await supabase
  .from('listings')
  .select(`
    *,
    user:profiles(name, avatar_url),
    leads(count)
  `)
  .eq('slug', slug)
  .single()

if (error) throw new Error(`Listing not found: ${error.message}`)
// Sau đây listing đã được guarantee là non-null

// ✅ Query với auth (RLS tự xử lý, không cần filter user_id thủ công)
const { data: myListings } = await supabase
  .from('listings')
  .select('*')
  .order('created_at', { ascending: false })
```

## Upload ảnh lên Storage

```ts
// src/lib/supabase/storage.ts
export async function uploadListingImage(
  supabase: SupabaseClient<Database>,
  file: File,
  listingId: string
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${listingId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('listing-images')
    .upload(path, file, { upsert: false })

  if (error) throw new Error(`Upload thất bại: ${error.message}`)

  const { data } = supabase.storage
    .from('listing-images')
    .getPublicUrl(path)

  return data.publicUrl
}
```

## RLS Policies (SQL)

```sql
-- listings table: chỉ chủ sở hữu mới đọc/sửa/xóa được
-- Public có thể đọc listing đang active
alter table listings enable row level security;

create policy "Public read active listings"
  on listings for select
  using (status = 'active');

create policy "Owner full access"
  on listings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- leads table: chỉ chủ listing mới đọc được leads của mình
create policy "Owner reads own leads"
  on leads for select
  using (
    listing_id in (
      select id from listings where user_id = auth.uid()
    )
  );

-- Anyone can insert a lead (form submit)
create policy "Anyone can submit lead"
  on leads for insert
  with check (true);
```

## Auth helper — lấy user hiện tại trong Server Component

```ts
// src/lib/supabase/auth.ts
import { redirect } from 'next/navigation'
import { createServerClient } from './server'

export async function requireAuth() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}
```

## Regenerate types sau khi thay đổi schema

```bash
npx supabase gen types typescript \
  --project-id <YOUR_PROJECT_ID> \
  > src/types/database.types.ts
```
