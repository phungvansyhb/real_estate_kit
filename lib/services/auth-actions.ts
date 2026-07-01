'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { defaultLocale, isLocale } from '@/i18n/routing'
import {
    buildAuthStatusUrl,
    getSafeRedirectPath,
    signInWithPassword,
    signOutCurrentUser,
    signUpWithPassword,
} from '@/lib/services/auth-service'

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  locale: z.string().optional(),
  next: z.string().optional(),
})

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  locale: z.string().optional(),
  next: z.string().optional(),
})

function getLocaleValue(formData: FormData) {
  const locale = formData.get('locale')?.toString()
  return locale && isLocale(locale) ? locale : defaultLocale
}

function getNextValue(formData: FormData) {
  return getSafeRedirectPath(formData.get('next')?.toString())
}

export async function signInAction(formData: FormData) {
  const locale = getLocaleValue(formData)
  const next = getNextValue(formData)

  const parsed = signInSchema.safeParse({
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
    locale,
    next,
  })

  if (!parsed.success) {
    redirect(buildAuthStatusUrl(locale, 'login', 'error', 'invalid-form', next))
  }

  const { error } = await signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    redirect(buildAuthStatusUrl(locale, 'login', 'error', 'invalid-credentials', next))
  }

  redirect(next)
}

export async function signUpAction(formData: FormData) {
  const locale = getLocaleValue(formData)
  const next = getNextValue(formData)

  const parsed = signUpSchema.safeParse({
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
    locale,
    next,
  })

  if (!parsed.success) {
    redirect(buildAuthStatusUrl(locale, 'signup', 'error', 'invalid-form', next))
  }

  const callbackPath = `/auth/callback?next=${encodeURIComponent(next)}&locale=${locale}`
  const { data, error } = await signUpWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
    emailRedirectToPath: callbackPath,
  })

  if (error) {
    redirect(buildAuthStatusUrl(locale, 'signup', 'error', 'signup-failed', next))
  }

  if (data.session) {
    redirect(next)
  }

  redirect(buildAuthStatusUrl(locale, 'login', 'message', 'check-email', next))
}

export async function signOutAction(formData: FormData) {
  const locale = getLocaleValue(formData)
  await signOutCurrentUser()

  redirect(buildAuthStatusUrl(locale, 'login', 'message', 'signed-out'))
}
