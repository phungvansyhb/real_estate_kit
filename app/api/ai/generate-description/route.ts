import { NextResponse } from 'next/server'
import { z } from 'zod'

import { generateFallbackDescription } from '@/lib/ai/generate-fallback-description'

const generateDescriptionSchema = z.object({
  title: z.string().min(5),
  address: z.string().min(5),
  propertyType: z.string().min(2),
  type: z.enum(['sell', 'rent']),
  price: z.number().optional(),
  area: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  amenities: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  const json = await request.json()
  const parsed = generateDescriptionSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Thiếu dữ liệu để tạo mô tả.' }, { status: 400 })
  }

  const description = generateFallbackDescription(parsed.data)

  return NextResponse.json({ data: { description } }, { status: 200 })
}
