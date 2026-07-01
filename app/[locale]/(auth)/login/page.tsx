import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { AuthSubmitButton } from '@/components/features/auth-submit-button'
import { SectionLabel } from '@/components/primitives/section-label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { isLocale, type Locale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'
import { buildAbsoluteUrl, buildLocalizedPath, getLanguageAlternates } from '@/lib/seo'
import { signInAction } from '@/lib/services/auth-actions'
import { getSafeRedirectPath } from '@/lib/services/auth-service'
import { getCurrentUser } from '@/lib/supabase/auth'

interface LoginPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ error?: string; message?: string; next?: string }>
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isLocale(locale)) {
    return {}
  }

  const content = getLocaleMessages(locale).Auth
  const canonicalPath = buildLocalizedPath(locale, '/login')

  return {
    title: content.login.metaTitle,
    description: content.login.description,
    alternates: {
      canonical: canonicalPath,
      languages: getLanguageAlternates('/login'),
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: 'website',
      url: buildAbsoluteUrl(canonicalPath),
      title: content.login.metaTitle,
      description: content.login.description,
    },
  }
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const { error, message, next } = await searchParams
  const content = getLocaleMessages(locale).Auth
  const redirectPath = getSafeRedirectPath(next)
  const user = await getCurrentUser()

  if (user) {
    redirect(redirectPath)
  }

  const signupHref = buildLocalizedPath(locale, redirectPath === '/dashboard' ? '/signup' : `/signup?next=${encodeURIComponent(redirectPath)}`)

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-8 lg:py-16">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
        <section className="flex flex-col justify-center space-y-6">
          <SectionLabel>{content.label}</SectionLabel>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
              {content.login.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{content.login.description}</p>
          </div>
          <div className="space-y-3 text-sm leading-7 text-slate-600">
            {content.benefits.map((benefit) => (
              <p key={benefit}>• {benefit}</p>
            ))}
          </div>
          <Link href={buildLocalizedPath(locale)}>
            <Button variant="outline">
              {content.backHome}
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{content.login.formTitle}</CardTitle>
            <CardDescription>{content.login.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signInAction} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="next" value={redirectPath} />

              {error ? <StatusMessage locale={locale} type="error" code={error} /> : null}
              {message ? <StatusMessage locale={locale} type="message" code={message} /> : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">
                  {content.fields.email}
                </label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  {content.fields.password}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <AuthSubmitButton
                className="w-full"
                idleLabel={content.login.submit}
                pendingLabel={content.login.submitting}
                intent="login"
              />
            </form>

            <div className="mt-6 border-t border-(--border) pt-6">
              <p className="text-sm text-slate-600">{content.login.switchText}</p>
              <Link href={signupHref} className="mt-3 inline-flex">
                <Button variant="outline">
                  {content.login.switchCta}
                  <UserPlus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function StatusMessage({
  locale,
  type,
  code,
}: {
  locale: Locale
  type: 'error' | 'message'
  code: string
}) {
  const content = getLocaleMessages(locale).Auth
  const message = type === 'error' ? content.errors[code as keyof typeof content.errors] : content.messages[code as keyof typeof content.messages]

  if (!message) {
    return null
  }

  return (
    <p
      className={
        type === 'error'
          ? 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'
          : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
      }
    >
      {message}
    </p>
  )
}
