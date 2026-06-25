import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isLocale } from '@/lib/i18n'

const leadSchema = z.object({
  listingId: z.string().min(1),
  name: z.string().min(2, 'Vui lòng nhập họ tên hợp lệ.'),
  phone: z
    .string()
    .min(9, 'Số điện thoại không hợp lệ.')
    .max(11, 'Số điện thoại không hợp lệ.')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ gồm chữ số.'),
  note: z.string().max(500).optional(),
  preferredTime: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
  locale: z.string().optional(),
})

export async function POST(request: Request) {
  const json = await request.json()
  const locale = typeof json.locale === 'string' && isLocale(json.locale) ? json.locale : 'vi'
  const parsed = leadSchema.safeParse(json)

  if (!parsed.success) {
    const message =
      locale === 'en'
        ? 'Please enter a valid lead form payload.'
        : parsed.error.issues[0]?.message ?? 'Dữ liệu lead không hợp lệ.'

    return NextResponse.json({ error: message }, { status: 400 })
  }

  return NextResponse.json(
    {
      data: {
        message:
          locale === 'en'
            ? 'Your viewing request has been received. The agent can now follow up to confirm the appointment.'
            : 'Yêu cầu xem nhà đã được ghi nhận. Môi giới có thể liên hệ lại để xác nhận lịch hẹn với bạn.',
      },
    },
    { status: 201 }
  )
}
