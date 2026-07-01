import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isLocale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'

export async function POST(request: Request) {
  const json = await request.json()
  const locale = typeof json.locale === 'string' && isLocale(json.locale) ? json.locale : 'vi'
  const messages = getLocaleMessages(locale).Api.leads

  const leadSchema = z.object({
    listingId: z.string().min(1),
    name: z.string().min(2, messages.errors.name),
    phone: z
      .string()
      .min(9, messages.errors.phone)
      .max(11, messages.errors.phone)
      .regex(/^[0-9]+$/, messages.errors.phoneDigits),
    note: z.string().max(500).optional(),
    preferredTime: z.string().max(100).optional(),
    source: z.string().max(50).optional(),
    locale: z.string().optional(),
  })

  const parsed = leadSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? messages.invalidPayload },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      data: {
        message: messages.success,
      },
    },
    { status: 201 }
  )
}
