import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

import { isLocale, locales } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={getLocaleMessages(locale)}>
      {children}
    </NextIntlClientProvider>
  )
}
