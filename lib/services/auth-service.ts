import { redirect } from 'next/navigation'

import { defaultLocale, isLocale, type Locale } from '@/i18n/routing'
import { buildAbsoluteUrl } from '@/lib/seo'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function normalizeLocale(locale?: string): Locale {
  return locale && isLocale(locale) ? locale : defaultLocale
}

export function getSafeRedirectPath(candidate?: string | null) {
  if (!candidate || !candidate.startsWith('/')) {
    return '/dashboard'
  }

  if (candidate.startsWith('//')) {
    return '/dashboard'
  }

  return candidate
}

export function buildAuthPageUrl(locale: string | undefined, page: 'login' | 'signup', next?: string | null) {
  const normalizedLocale = normalizeLocale(locale)
  const params = new URLSearchParams()
  const redirectPath = getSafeRedirectPath(next)

  if (redirectPath !== '/dashboard') {
    params.set('next', redirectPath)
  }

  const query = params.toString()

  return `/${normalizedLocale}/${page}${query ? `?${query}` : ''}`
}

export function buildAuthStatusUrl(
  locale: string | undefined,
  page: 'login' | 'signup',
  key: 'error' | 'message',
  value: string,
  next?: string | null
) {
  const normalizedLocale = normalizeLocale(locale)
  const redirectPath = getSafeRedirectPath(next)
  const params = new URLSearchParams({
    [key]: value,
  })

  if (redirectPath !== '/dashboard') {
    params.set('next', redirectPath)
  }

  return `/${normalizedLocale}/${page}?${params.toString()}`
}

export async function requireAuthenticatedUser(nextPath = '/dashboard', locale?: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(buildAuthPageUrl(locale, 'login', nextPath))
  }

  return user
}

export async function signInWithPassword(input: { email: string; password: string }) {
  const supabase = await createSupabaseServerClient()

  return supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })
}

export async function signUpWithPassword(input: {
  email: string
  password: string
  emailRedirectToPath?: string
}) {
  const supabase = await createSupabaseServerClient()
  const emailRedirectTo = buildAbsoluteUrl(input.emailRedirectToPath ?? '/auth/callback')

  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo,
    },
  })
}

export async function signOutCurrentUser() {
  const supabase = await createSupabaseServerClient()
  return supabase.auth.signOut()
}
