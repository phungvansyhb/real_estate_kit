'use client'

import Image from 'next/image'
import { Bath, BedDouble, MapPin, MessageCircleMore, Phone, Square, Star } from 'lucide-react'

import { ListingBadge } from '@/components/primitives/listing-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sampleListings } from '@/lib/mock-data'
import {
  createSlug,
  formatArea,
  formatCompactNumber,
  formatCurrency,
  formatListingIntent,
  formatPropertyType,
} from '@/lib/utils'
import type { ListingIntent, PropertyType } from '@/types/listing'

export interface CreateListingPreviewValues {
  title: string
  address: string
  price: string
  area: string
  bedrooms: string
  bathrooms: string
  propertyType: PropertyType
  transactionType: ListingIntent
  propertySubtype: string
  amenities: string[]
  description: string
}

interface CreateListingPreviewProps {
  values: CreateListingPreviewValues
  supportsRooms: boolean
  showHeader?: boolean
}

const previewCopy = {
  headerTitle: 'Xem trước trang giới thiệu',
  headerDescription: 'Bố cục preview bám sát landing page public để bạn dễ kiểm tra nội dung và điểm nhấn trước khi lưu.',
  publicUrlLabel: 'Đường dẫn công khai',
  descriptionTitle: 'Mô tả bất động sản',
  descriptionHint: 'Nội dung này sẽ xuất hiện ở phần giới thiệu tài sản trên landing page.',
  amenitiesTitle: 'Tiện ích nổi bật',
  amenitiesEmpty: 'Chưa chọn tiện ích nào cho tin đăng này.',
  agentTitle: 'Thông tin môi giới',
  agentHint: 'Khối liên hệ ở cột phải sẽ hiển thị tương tự sau khi xuất bản.',
  callNow: 'Gọi ngay',
  chatZalo: 'Chat Zalo',
  metrics: {
    area: 'Diện tích',
    bedrooms: 'Phòng ngủ',
    bathrooms: 'Phòng tắm',
    views: 'Lượt xem',
  },
  draftDescription:
    'Bấm nút AI để tạo mô tả dựa trên loại hình, nhu cầu và các điểm nổi bật bạn vừa chọn.',
} as const

function parseOptionalNumber(value: string) {
  const normalized = value.trim()

  if (!normalized) {
    return undefined
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

function buildLocation(address: string) {
  const segments = address
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (segments.length >= 3) {
    return {
      addressLine: segments.slice(0, -2).join(', '),
      district: segments.at(-2) ?? 'Khu vực đang cập nhật',
      city: segments.at(-1) ?? 'Thành phố đang cập nhật',
      fullAddress: segments.join(', '),
    }
  }

  return {
    addressLine: address || 'Địa chỉ đang cập nhật',
    district: 'Khu vực đang cập nhật',
    city: 'Thành phố đang cập nhật',
    fullAddress: address || 'Địa chỉ đang cập nhật',
  }
}

function getPreviewImages(propertyType: PropertyType) {
  return sampleListings.find((listing) => listing.propertyType === propertyType)?.images ?? sampleListings[0].images
}

export function CreateListingPreview({ values, supportsRooms, showHeader = true }: CreateListingPreviewProps) {
  const previewSlug = createSlug(values.title) || 'tin-dang-moi'
  const previewImages = getPreviewImages(values.propertyType)
  const previewAgent = sampleListings[0].agent
  const location = buildLocation(values.address)
  const area = parseOptionalNumber(values.area)
  const bedrooms = parseOptionalNumber(values.bedrooms)
  const bathrooms = parseOptionalNumber(values.bathrooms)
  const price = parseOptionalNumber(values.price)

  const metricItems = [
    {
      key: 'area',
      icon: <Square className="mb-3 h-5 w-5 text-sky-700" />,
      label: previewCopy.metrics.area,
      value: area ? formatArea(area) : 'Chưa nhập',
    },
    ...(supportsRooms
      ? [
          {
            key: 'bedrooms',
            icon: <BedDouble className="mb-3 h-5 w-5 text-sky-700" />,
            label: previewCopy.metrics.bedrooms,
            value: bedrooms ? String(bedrooms) : 'Chưa nhập',
          },
          {
            key: 'bathrooms',
            icon: <Bath className="mb-3 h-5 w-5 text-sky-700" />,
            label: previewCopy.metrics.bathrooms,
            value: bathrooms ? String(bathrooms) : 'Chưa nhập',
          },
        ]
      : []),
    {
      key: 'views',
      icon: <Star className="mb-3 h-5 w-5 text-sky-700" />,
      label: previewCopy.metrics.views,
      value: formatCompactNumber(0),
    },
  ]

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      {showHeader ? (
        <CardHeader className="border-b border-slate-200 bg-slate-50/70">
          <CardTitle>{previewCopy.headerTitle}</CardTitle>
          <CardDescription>{previewCopy.headerDescription}</CardDescription>
        </CardHeader>
      ) : null}

      <CardContent className="space-y-6 p-4 md:p-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">{previewCopy.publicUrlLabel}</p>
          <p className="mt-2 break-all text-sm font-semibold text-slate-950 md:text-base">listingkit.vn/l/{previewSlug}</p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <ListingBadge status="draft" />
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {formatPropertyType(values.propertyType)}
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {formatListingIntent(values.transactionType)}
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {values.propertySubtype}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
                  {values.title}
                </h2>
                <div className="flex items-start gap-2 text-slate-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="leading-6">{location.fullAddress}</span>
                </div>
                <p className="text-2xl font-semibold text-slate-950 md:text-3xl">
                  {price ? formatCurrency(price) : 'Chưa nhập giá'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metricItems.map((item) => (
                  <div key={item.key} className="rounded-3xl border border-slate-200 bg-white p-5">
                    {item.icon}
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="relative min-h-72 overflow-hidden rounded-[28px] bg-slate-100">
                  <Image
                    src={previewImages[0]}
                    alt={values.title}
                    fill
                    sizes="(min-width: 1280px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="grid gap-4">
                  {previewImages.slice(1, 3).map((image) => (
                    <div key={image} className="relative min-h-34 overflow-hidden rounded-[28px] bg-slate-100">
                      <Image
                        src={image}
                        alt={values.title}
                        fill
                        sizes="(min-width: 1280px) 24vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{previewCopy.descriptionTitle}</CardTitle>
                  <CardDescription>{previewCopy.descriptionHint}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-8 text-slate-600">
                    {values.description || previewCopy.draftDescription}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{previewCopy.amenitiesTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {values.amenities.length > 0 ? (
                      values.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700"
                        >
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">{previewCopy.amenitiesEmpty}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
              <Card className="border-slate-950 bg-slate-950 text-white">
                <CardHeader>
                  <CardTitle className="text-white">{previewCopy.agentTitle}</CardTitle>
                  <CardDescription className="text-slate-300">{previewCopy.agentHint}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4">
                    <Image
                      src={previewAgent.avatarUrl}
                      alt={previewAgent.name}
                      width={56}
                      height={56}
                      className="rounded-2xl object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-white">{previewAgent.name}</p>
                      <p className="text-sm text-slate-300">{previewAgent.company}</p>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    <p>{location.addressLine}</p>
                    <p>
                      {location.district}, {location.city}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Button className="w-full" variant="secondary" disabled>
                      {previewCopy.callNow} {previewAgent.phone}
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button className="w-full" disabled>
                      {previewCopy.chatZalo}
                      <MessageCircleMore className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
