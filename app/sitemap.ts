import type { MetadataRoute } from 'next'

import { locales } from '@/i18n/routing'
import { buildAbsoluteUrl, buildLocalizedPath } from '@/lib/seo'
import { listPublicListings } from '@/lib/services/listing-service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homeEntries = locales.map((locale) => ({
    url: buildAbsoluteUrl(buildLocalizedPath(locale)),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: locale === 'vi' ? 1 : 0.9,
  }))

  const listings = await listPublicListings()

  const listingEntries = listings.flatMap((listing) =>
    locales.map((locale) => ({
      url: buildAbsoluteUrl(buildLocalizedPath(locale, `/l/${listing.slug}`)),
      lastModified: new Date(listing.createdAt),
      changeFrequency: 'weekly' as const,
      priority: listing.featured ? 0.9 : 0.8,
    }))
  )

  return [...homeEntries, ...listingEntries]
}
