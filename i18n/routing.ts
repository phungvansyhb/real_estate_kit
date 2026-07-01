import { hasLocale } from 'next-intl'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
})

export const locales = routing.locales
export const defaultLocale = routing.defaultLocale
export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return hasLocale(locales, value)
}
