---
name: nextjs-conventions
description: >
  Khi cần tạo page, layout, API route, Server/Client component, hoặc data fetching
  theo chuẩn Next.js 16 App Router với TypeScript. Dùng khi bắt đầu file mới
  hoặc refactor component sang đúng pattern.
---

# Next.js 16 App Router — Conventions cho ListingKit

## Server Component (mặc định)

```tsx
// src/app/(dashboard)/listings/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/features/listing-card'

export default async function ListingsPage() {
  const supabase = await createServerClient()
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Không thể tải danh sách listing')
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
```

## Client Component

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface LeadFormProps {
  listingId: string
  onSuccess?: () => void
}

export function LeadForm({ listingId, onSuccess }: LeadFormProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    // ...
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Đang gửi...' : 'Đặt lịch xem nhà'}
      </Button>
    </form>
  )
}
```

## API Route với Zod validation

```ts
// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const LeadSchema = z.object({
  listing_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[0-9]{9,11}$/),
  note: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = LeadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('leads')
    .insert(parsed.data)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
```

## Server Action (thay thế API route cho form đơn giản)

```ts
// src/app/(dashboard)/listings/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { ListingSchema } from '@/types/listing'

export async function createListing(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = ListingSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from('listings').insert(parsed.data)

  if (error) return { error: error.message }

  revalidatePath('/listings')
  return { success: true }
}
```

## Metadata cho public listing page

```tsx
// src/app/l/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  // fetch listing...
  return {
    title: `${listing.title} | ListingKit`,
    description: listing.description?.slice(0, 160),
    openGraph: {
      images: [listing.images[0]],
    },
  }
}
```

## Loading & Error boundaries

```
app/
├── (dashboard)/
│   ├── listings/
│   │   ├── page.tsx
│   │   ├── loading.tsx   ← skeleton tự động
│   │   └── error.tsx     ← error boundary tự động
```
