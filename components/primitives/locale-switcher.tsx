import Link from 'next/link'
import { useTranslations } from 'next-intl'

import type { Locale } from '@/i18n/routing'
import { locales } from '@/i18n/routing'
import { cn } from '@/lib/utils'

interface LocaleSwitcherProps {
  currentLocale: Locale
  pathResolver: (locale: Locale) => string
}

export function LocaleSwitcher({ currentLocale, pathResolver }: LocaleSwitcherProps) {
  const t = useTranslations('LocaleSwitcher')

  return (
    <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-white p-1 shadow-sm">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathResolver(locale)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
            locale === currentLocale
              ? 'bg-slate-950 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
          )}
        >
          {t(locale)}
        </Link>
      ))}
    </div>
  )
}
