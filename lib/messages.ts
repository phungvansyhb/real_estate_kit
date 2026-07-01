import type { Locale } from '@/i18n/routing'
import enMessages from '@/messages/en.json'
import viMessages from '@/messages/vi.json'

export type AppMessages = typeof viMessages

const appMessages: Record<Locale, AppMessages> = {
  vi: viMessages,
  en: enMessages,
}

export function getLocaleMessages(locale: Locale): AppMessages {
  return appMessages[locale]
}
