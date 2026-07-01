import { NextResponse } from 'next/server'

import { defaultLocale, isLocale } from '@/i18n/routing'
import { buildAuthStatusUrl, getSafeRedirectPath } from '@/lib/services/auth-service'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = getSafeRedirectPath(requestUrl.searchParams.get('next'))
  const localeParam = requestUrl.searchParams.get('locale')
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale

  if (!code) {
    return NextResponse.redirect(
      new URL(buildAuthStatusUrl(locale, 'login', 'error', 'invalid-session', next), request.url)
    )
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL(buildAuthStatusUrl(locale, 'login', 'error', 'invalid-session', next), request.url)
    )
  }

  return NextResponse.redirect(new URL(next, request.url))
}
