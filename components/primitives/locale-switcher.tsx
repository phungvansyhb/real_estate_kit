import Link from 'next/link'

import type { Locale } from '@/lib/i18n'
import { localeLabels, locales } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LocaleSwitcherProps {
  currentLocale: Locale
  pathResolver: (locale: Locale) => string
}

export function LocaleSwitcher({ currentLocale, pathResolver }: LocaleSwitcherProps) {
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
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  )
}
