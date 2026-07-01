import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bath,
  BedDouble,
  LayoutDashboard,
  ListPlus,
  MapPin,
  MessageCircleMore,
  Phone,
  Square,
  Star,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { LeadForm } from '@/components/features/lead-form'
import { QrDownloadButton } from '@/components/features/qr-download-button'
import { LocaleSwitcher } from '@/components/primitives/locale-switcher'
import { ListingBadge } from '@/components/primitives/listing-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isLocale, locales } from '@/i18n/routing'
import { getLocalizedListing } from '@/lib/listing-translations'
import { getLocaleMessages } from '@/lib/messages'
import { getListingBySlug, listListingSlugs } from '@/lib/services/listing-service'
import { buildAbsoluteUrl, buildLocalizedPath, getLanguageAlternates } from '@/lib/seo'
import {
  formatArea,
  formatCompactNumber,
  formatCurrency,
  formatListingIntent,
  formatPropertyType,
} from '@/lib/utils'

interface LocalizedListingPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await listListingSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: LocalizedListingPageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    return {}
  }

  const pageMessages = getLocaleMessages(locale).ListingPage
  const listing = await getListingBySlug(slug)

  if (!listing) {
    return {
      title: pageMessages.notFoundTitle,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const localized = getLocalizedListing(listing, locale)
  const description = localized.description.slice(0, 155)
  const canonicalPath = buildLocalizedPath(locale, `/l/${listing.slug}`)

  return {
    title: `${localized.title} | ListingKit`,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: getLanguageAlternates(`/l/${listing.slug}`),
    },
    openGraph: {
      type: 'website',
      url: buildAbsoluteUrl(canonicalPath),
      title: localized.title,
      description,
      images: [listing.images[0]],
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
    },
    twitter: {
      card: 'summary_large_image',
      title: localized.title,
      description,
      images: [listing.images[0]],
    },
  }
}

export default async function LocalizedListingPage({ params }: LocalizedListingPageProps) {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const listing = await getListingBySlug(slug)

  if (!listing) {
    notFound()
  }

  const content = getLocaleMessages(locale).ListingPage
  const localized = getLocalizedListing(listing, locale)
  const canonicalPath = buildLocalizedPath(locale, `/l/${listing.slug}`)
  const hasDirectPhone = Boolean(listing.agent.phone.trim())
  const metricItems = [
    {
      key: 'area',
      icon: <Square className="mb-3 h-5 w-5 text-sky-700" />,
      label: content.metrics.area,
      value: formatArea(listing.area, locale),
    },
    ...(typeof listing.bedrooms === 'number'
      ? [
          {
            key: 'bedrooms',
            icon: <BedDouble className="mb-3 h-5 w-5 text-sky-700" />,
            label: content.metrics.bedrooms,
            value: String(listing.bedrooms),
          },
        ]
      : []),
    ...(typeof listing.bathrooms === 'number'
      ? [
          {
            key: 'bathrooms',
            icon: <Bath className="mb-3 h-5 w-5 text-sky-700" />,
            label: content.metrics.bathrooms,
            value: String(listing.bathrooms),
          },
        ]
      : []),
    {
      key: 'views',
      icon: <Star className="mb-3 h-5 w-5 text-sky-700" />,
      label: content.metrics.views,
      value: formatCompactNumber(listing.viewCount, locale),
    },
  ]
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ListingKit',
        item: buildAbsoluteUrl(buildLocalizedPath(locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: localized.title,
        item: buildAbsoluteUrl(canonicalPath),
      },
    ],
  }
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localized.title,
    description: localized.description,
    image: listing.images,
    category: formatPropertyType(listing.propertyType, locale),
    brand: {
      '@type': 'Brand',
      name: listing.agent.company,
    },
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'VND',
      availability:
        listing.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/LimitedAvailability',
      url: buildAbsoluteUrl(canonicalPath),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <main lang={locale} className="pb-16">
        <section className="border-b border-(--border) bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <Link href={`/${locale}`} className="text-sm font-medium text-slate-950">
                ListingKit
              </Link>
              <p className="mt-1 text-sm text-slate-500">{content.publicLabel}</p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="hidden items-center gap-3 md:flex">
                <Link href="/dashboard">
                  <Button variant="outline">
                    {content.viewDashboard}
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/listings/new">
                  <Button>
                    {content.createListing}
                    <ListPlus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <LocaleSwitcher
                currentLocale={locale}
                pathResolver={(targetLocale) => buildLocalizedPath(targetLocale, `/l/${listing.slug}`)}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 pt-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:pt-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <ListingBadge status={listing.status} locale={locale} />
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {formatPropertyType(listing.propertyType, locale)}
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {formatListingIntent(listing.type, locale)}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-5xl">
                {localized.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4" />
                <span>
                  {listing.address}, {listing.district}, {listing.city}
                </span>
              </div>
              <p className="text-3xl font-semibold text-slate-950">{formatCurrency(listing.price, locale)}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metricItems.map((item) => (
                <MetricCard key={item.key} icon={item.icon} label={item.label} value={item.value} />
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-80 overflow-hidden rounded-[28px] bg-slate-100">
                <Image
                  src={listing.images[0]}
                  alt={localized.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                {listing.images.slice(1).map((image) => (
                  <div key={image} className="relative min-h-56 overflow-hidden rounded-[28px] bg-slate-100">
                    <Image
                      src={image}
                      alt={localized.title}
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{content.propertyDescription}</CardTitle>
                <CardDescription>{content.propertyDescriptionHint}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-8 text-slate-600">{localized.description}</p>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{content.amenities}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {localized.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{content.traffic}</CardTitle>
                  <CardDescription>{content.trafficHint}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {listing.sourceBreakdown.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{getTrafficSourceLabel(item.label, content)}</span>
                        <span>{item.value}%</span>
                      </div>
                      <progress
                        className="h-2 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:bg-slate-900 [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-slate-900"
                        value={item.value}
                        max={100}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card className="border-slate-950 bg-slate-950 text-white">
              <CardHeader>
                <CardTitle className="text-white">{content.agentInfo}</CardTitle>
                <CardDescription className="text-slate-300">{content.agentHint}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={listing.agent.avatarUrl}
                    alt={listing.agent.name}
                    width={56}
                    height={56}
                    className="rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-white">{listing.agent.name}</p>
                    <p className="text-sm text-slate-300">
                      {listing.agent.company || content.agentCompanyFallback}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <AgentInfoItem label={content.agentCompany} value={listing.agent.company || content.agentCompanyFallback} />
                  <AgentInfoItem label={content.agentPhone} value={listing.agent.phone || content.agentPhoneFallback} />
                  <AgentInfoItem label={content.agentBio} value={listing.agent.bio || content.agentBioFallback} multiline />
                </div>

                <div className="grid gap-3">
                  {hasDirectPhone ? (
                    <>
                      <a href={`tel:${listing.agent.phone}`}>
                        <Button className="w-full" variant="secondary">
                          {content.callNow} {listing.agent.phone}
                          <Phone className="h-4 w-4" />
                        </Button>
                      </a>
                      <a href={`https://zalo.me/${listing.agent.phone}`} target="_blank" rel="noreferrer">
                        <Button className="w-full">
                          {content.chatZalo}
                          <MessageCircleMore className="h-4 w-4" />
                        </Button>
                      </a>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm leading-6 text-slate-300">
                      {content.contactUnavailable}
                    </div>
                  )}
                  <QrDownloadButton slug={listing.slug} locale={locale} label={content.downloadQr} />
                </div>
              </CardContent>
            </Card>

            <LeadForm listingId={listing.id} locale={locale} />
          </div>
        </section>
      </main>
    </>
  )
}

function getTrafficSourceLabel(
  label: string,
  content: ReturnType<typeof getLocaleMessages>['ListingPage']
) {
  return content.trafficSources[label as keyof typeof content.trafficSources] ?? label
}

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: string
}

interface AgentInfoItemProps {
  label: string
  value: string
  multiline?: boolean
}

function AgentInfoItem({ label, value, multiline = false }: AgentInfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">{label}</p>
      <p className={multiline ? 'text-sm leading-6 text-white' : 'text-sm text-white'}>{value}</p>
    </div>
  )
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-(--border) bg-white p-5">
      {icon}
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  )
}
