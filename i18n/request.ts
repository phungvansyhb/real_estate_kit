import { getRequestConfig } from 'next-intl/server'

import { defaultLocale, isLocale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale
  const locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : defaultLocale

  return {
    locale,
    messages: getLocaleMessages(locale),
  }
})
