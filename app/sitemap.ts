import type { MetadataRoute } from 'next'

import { locales } from '@/lib/i18n'
import { sampleListings } from '@/lib/mock-data'
import { buildAbsoluteUrl, buildLocalizedPath } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntries = locales.map((locale) => ({
    url: buildAbsoluteUrl(buildLocalizedPath(locale)),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: locale === 'vi' ? 1 : 0.9,
  }))

  const listingEntries = sampleListings.flatMap((listing) =>
    locales.map((locale) => ({
      url: buildAbsoluteUrl(buildLocalizedPath(locale, `/l/${listing.slug}`)),
      lastModified: new Date(listing.createdAt),
      changeFrequency: 'weekly' as const,
      priority: listing.featured ? 0.9 : 0.8,
    }))
  )

  return [...homeEntries, ...listingEntries]
}
