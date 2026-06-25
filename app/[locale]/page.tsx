import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HomePage } from '@/components/features/home-page'
import { defaultLocale, homeContent, isLocale, locales, type Locale } from '@/lib/i18n'
import { sampleListings } from '@/lib/mock-data'
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

  const content = homeContent[locale]
  const canonicalPath = buildLocalizedPath(locale)

  return {
    title:
      locale === 'vi'
        ? 'ListingKit | Trang giới thiệu bất động sản giúp môi giới chốt khách nhanh hơn'
        : 'ListingKit | Property pages that help agents win trust and book more viewings',
    description: content.heroDescription,
    alternates: {
      canonical: canonicalPath,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      type: 'website',
      url: buildAbsoluteUrl(canonicalPath),
      title:
        locale === 'vi'
          ? 'ListingKit | Trang giới thiệu bất động sản giúp môi giới chốt khách nhanh hơn'
          : 'ListingKit | Property pages that help agents win trust and book more viewings',
      description: content.heroDescription,
      images: [sampleListings[0].images[0]],
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
    },
    twitter: {
      card: 'summary_large_image',
      title:
        locale === 'vi'
          ? 'ListingKit | Trang giới thiệu bất động sản giúp môi giới chốt khách nhanh hơn'
          : 'ListingKit | Property pages that help agents win trust and book more viewings',
      description: content.heroDescription,
      images: [sampleListings[0].images[0]],
    },
  }
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const content = homeContent[locale]
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
      <HomePage locale={locale} />
    </>
  )
}

function canonicalHomePath(locale: Locale) {
  return buildLocalizedPath(locale)
}
