import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, LogIn } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { AuthSubmitButton } from '@/components/features/auth-submit-button'
import { SectionLabel } from '@/components/primitives/section-label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { isLocale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'
import { buildAbsoluteUrl, buildLocalizedPath, getLanguageAlternates } from '@/lib/seo'
import { signUpAction } from '@/lib/services/auth-actions'
import { getSafeRedirectPath } from '@/lib/services/auth-service'
import { getCurrentUser } from '@/lib/supabase/auth'

interface SignupPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ error?: string; next?: string }>
}

export async function generateMetadata({ params }: SignupPageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isLocale(locale)) {
    return {}
  }

  const content = getLocaleMessages(locale).Auth
  const canonicalPath = buildLocalizedPath(locale, '/signup')

  return {
    title: content.signup.metaTitle,
    description: content.signup.description,
    alternates: {
      canonical: canonicalPath,
      languages: getLanguageAlternates('/signup'),
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: 'website',
      url: buildAbsoluteUrl(canonicalPath),
      title: content.signup.metaTitle,
      description: content.signup.description,
    },
  }
}

export default async function SignupPage({ params, searchParams }: SignupPageProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const { error, next } = await searchParams
  const content = getLocaleMessages(locale).Auth
  const redirectPath = getSafeRedirectPath(next)
  const user = await getCurrentUser()

  if (user) {
    redirect(redirectPath)
  }

  const loginHref = buildLocalizedPath(locale, redirectPath === '/dashboard' ? '/login' : `/login?next=${encodeURIComponent(redirectPath)}`)

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-8 lg:py-16">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
        <section className="flex flex-col justify-center space-y-6">
          <SectionLabel>{content.label}</SectionLabel>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
              {content.signup.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{content.signup.description}</p>
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
            <CardTitle>{content.signup.formTitle}</CardTitle>
            <CardDescription>{content.signup.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signUpAction} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="next" value={redirectPath} />

              {error ? <SignupError locale={locale} code={error} /> : null}

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
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <p className="text-sm text-slate-500">{content.signup.passwordHint}</p>
              </div>

              <AuthSubmitButton
                className="w-full"
                idleLabel={content.signup.submit}
                pendingLabel={content.signup.submitting}
                intent="signup"
              />
            </form>

            <div className="mt-6 border-t border-(--border) pt-6">
              <p className="text-sm text-slate-600">{content.signup.switchText}</p>
              <Link href={loginHref} className="mt-3 inline-flex">
                <Button variant="outline">
                  {content.signup.switchCta}
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function SignupError({ locale, code }: { locale: 'vi' | 'en'; code: string }) {
  const content = getLocaleMessages(locale).Auth
  const message = content.errors[code as keyof typeof content.errors]

  if (!message) {
    return null
  }

  return <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</p>
}
