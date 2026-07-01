import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { Locale } from '@/i18n/routing'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getNumberLocale(locale: Locale) {
  return locale === 'vi' ? 'vi-VN' : 'en-US'
}

export function formatCurrency(value: number, locale: Locale = 'vi') {
  return new Intl.NumberFormat(getNumberLocale(locale), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactNumber(value: number, locale: Locale = 'vi') {
  return new Intl.NumberFormat(getNumberLocale(locale), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatArea(value: number, locale: Locale = 'vi') {
  return `${new Intl.NumberFormat(getNumberLocale(locale)).format(value)} m²`
}

export function formatListingIntent(value: 'sell' | 'rent', locale: Locale = 'vi') {
  if (locale === 'en') {
    return value === 'sell' ? 'For sale' : 'For rent'
  }

  return value === 'sell' ? 'Đang bán' : 'Cho thuê'
}

export function formatPropertyType(value: string, locale: Locale = 'vi') {
  const labels: Record<string, Record<Locale, string>> = {
    apartment: { vi: 'Chung cư / căn hộ', en: 'Apartment / condo' },
    house: { vi: 'Nhà', en: 'House' },
    land: { vi: 'Đất', en: 'Land plot' },
    villa: { vi: 'Biệt thự', en: 'Villa' },
    shophouse: { vi: 'Shophouse', en: 'Shophouse' },
  }

  return labels[value]?.[locale] ?? value
}

export function createSlug(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70)
}
