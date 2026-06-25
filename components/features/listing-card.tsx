import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bath, BedDouble, Eye, MapPin, QrCode, Square } from 'lucide-react'

import { ListingBadge } from '@/components/primitives/listing-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getLocalizedListing, type Locale } from '@/lib/i18n'
import { buildLocalizedPath } from '@/lib/seo'
import { formatArea, formatCurrency, formatPropertyType } from '@/lib/utils'
import type { Listing } from '@/types/listing'

interface ListingCardProps {
  listing: Listing
  locale?: Locale
}

export function ListingCard({ listing, locale = 'vi' }: ListingCardProps) {
  const localized = getLocalizedListing(listing, locale)
  const listingPath = buildLocalizedPath(locale, `/l/${listing.slug}`)
  const viewLabel = locale === 'vi' ? 'Xem trang giới thiệu' : 'View landing page'

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={listing.images[0]}
          alt={localized.title}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <ListingBadge status={listing.status} locale={locale} />
          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
            {formatPropertyType(listing.propertyType, locale)}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-xl">{localized.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">
            {listing.district}, {listing.city}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-semibold text-slate-950">{formatCurrency(listing.price, locale)}</p>
          <p className="mt-1 text-sm text-slate-500">{listing.address}</p>
        </div>

        <div className="grid grid-cols-4 gap-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-3 text-center">
            <Square className="mx-auto mb-2 h-4 w-4" />
            <span>{formatArea(listing.area, locale)}</span>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-center">
            <BedDouble className="mx-auto mb-2 h-4 w-4" />
            <span>{listing.bedrooms}</span>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-center">
            <Bath className="mx-auto mb-2 h-4 w-4" />
            <span>{listing.bathrooms}</span>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-center">
            <Eye className="mx-auto mb-2 h-4 w-4" />
            <span>{listing.viewCount}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3 sm:flex-row">
        <Link href={listingPath} className="flex-1">
          <Button className="w-full">
            {viewLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <a href={`/api/qr/${listing.slug}?locale=${locale}`} download={`${listing.slug}-${locale}.png`} className="sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            {locale === 'vi' ? 'Tải mã QR' : 'Download QR'}
            <QrCode className="h-4 w-4" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}
