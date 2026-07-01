import QRCode from 'qrcode'

import { defaultLocale, isLocale } from '@/i18n/routing'
import { buildLocalizedPath } from '@/lib/seo'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const requestUrl = new URL(request.url)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? requestUrl.origin
  const localeParam = requestUrl.searchParams.get('locale')
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale
  const publicUrl = `${appUrl}${buildLocalizedPath(locale, `/l/${slug}`)}`

  const buffer = await QRCode.toBuffer(publicUrl, {
    type: 'png',
    width: 400,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  })

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': `attachment; filename="${slug}.png"`,
    },
  })
}
