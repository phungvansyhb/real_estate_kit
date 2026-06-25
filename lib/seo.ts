import type { Locale } from '@/lib/i18n'

const fallbackBaseUrl = 'http://localhost:3000'

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? fallbackBaseUrl
}

export function getBaseMetadataUrl() {
  return new URL(getBaseUrl())
}

export function buildAbsoluteUrl(path: string) {
  return new URL(path, getBaseUrl()).toString()
}

export function buildLocalizedPath(locale: Locale, path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`
}

export function getLanguageAlternates(path = '') {
  return {
    vi: buildAbsoluteUrl(buildLocalizedPath('vi', path)),
    en: buildAbsoluteUrl(buildLocalizedPath('en', path)),
  }
}

export function getLocalePrefix(pathname: string) {
  return pathname === '/' ? pathname : pathname.replace(/\/+$/, '')
}
