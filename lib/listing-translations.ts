import type { Locale } from '@/i18n/routing'
import enListingTranslations from '@/messages/listings/en.json'
import type { Listing } from '@/types/listing'

export function getLocalizedListing(listing: Listing, locale: Locale) {
  if (locale === 'vi') {
    return {
      title: listing.title,
      description: listing.description,
      amenities: listing.amenities,
    }
  }

  const translation = enListingTranslations[listing.slug as keyof typeof enListingTranslations]

  return {
    title: translation?.title ?? listing.title,
    description: translation?.description ?? listing.description,
    amenities: translation?.amenities ?? listing.amenities,
  }
}
