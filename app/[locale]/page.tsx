import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HomePage } from '@/components/features/home-page'
import { defaultLocale, isLocale, locales, type Locale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'
import { getFeaturedListing, listHomepageListings } from '@/lib/services/listing-service'
import { buildAbsoluteUrl, buildLocalizedPath, getLanguageAlternates } from '@/lib/seo'

interface LocalizedHomePageProps {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocalizedHomePageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isLocale(locale)) {
    return {}
  }

  const content = getLocaleMessages(locale).HomePage
  const canonicalPath = buildLocalizedPath(locale)
  const featuredListing = await getFeaturedListing()

  return {
    title: content.metaTitle,
    description: content.heroDescription,
    alternates: {
      canonical: canonicalPath,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      type: 'website',
      url: buildAbsoluteUrl(canonicalPath),
      title: content.metaTitle,
      description: content.heroDescription,
      images: featuredListing ? [featuredListing.images[0]] : [],
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.heroDescription,
      images: featuredListing ? [featuredListing.images[0]] : [],
    },
  }
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const content = getLocaleMessages(locale).HomePage
  const [featuredListing, homepageListings] = await Promise.all([getFeaturedListing(), listHomepageListings()])

  if (!featuredListing) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'ListingKit',
        url: buildAbsoluteUrl(buildLocalizedPath(defaultLocale)),
        description: content.heroDescription,
      },
      {
        '@type': 'WebSite',
        name: 'ListingKit',
        url: buildAbsoluteUrl(canonicalHomePath(locale)),
        inLanguage: locale,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'ListingKit',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: locale,
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: 0,
          highPrice: 49,
          priceCurrency: 'USD',
        },
        description: content.heroDescription,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage locale={locale} featuredListing={featuredListing} listings={homepageListings} />
    </>
  )
}

function canonicalHomePath(locale: Locale) {
  return buildLocalizedPath(locale)
}
