'use client'

import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Check,
  CircleDot,
  Eye,
  FileText,
  House,
  LandPlot,
  LoaderCircle,
  Save,
  Sparkles,
  Store,
  Tag,
  Trees,
} from 'lucide-react'

import { CreateListingPreview } from '@/components/features/create-listing-preview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  getPropertyTypeConfig,
  getPropertyTypeOption,
  listingIntentOptions,
  propertyTypeOptions,
} from '@/lib/listing-form-options'
import { createSlug } from '@/lib/utils'
import type { ListingIntent, PropertyType } from '@/types/listing'

interface ListingFormValues {
  title: string
  address: string
  price: string
  area: string
  bedrooms: string
  bathrooms: string
  propertyType: PropertyType
  transactionType: ListingIntent
  propertySubtype: string
  selectedAmenities: string[]
  customAmenities: string
  description: string
}

const propertyTypeIcons: Record<PropertyType, LucideIcon> = {
  apartment: Building2,
  house: House,
  land: LandPlot,
  villa: Trees,
  shophouse: Store,
}

const listingIntentIcons: Record<ListingIntent, LucideIcon> = {
  sell: Tag,
  rent: CircleDot,
}

function parseOptionalNumber(value: string) {
  const normalized = value.trim()

  if (!normalized) {
    return undefined
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseAmenities(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const initialPropertyType: PropertyType = 'apartment'
const initialConfig = getPropertyTypeConfig(initialPropertyType)

const initialState: ListingFormValues = {
  title: 'Căn hộ 2PN gần Metro An Phú',
  address: 'Xa lộ Hà Nội, Phường An Phú, TP. Hồ Chí Minh',
  price: '4200000000',
  area: '72',
  bedrooms: '2',
  bathrooms: '2',
  propertyType: initialPropertyType,
  transactionType: 'sell',
  propertySubtype: initialConfig.subtypeOptions[0],
  selectedAmenities: ['Gần Metro', 'Hồ bơi', 'Phòng gym'],
  customAmenities: 'Trường học, trung tâm thương mại',
  description: '',
}

export function CreateListingForm() {
  const [values, setValues] = useState(initialState)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const propertyConfig = useMemo(() => getPropertyTypeConfig(values.propertyType), [values.propertyType])
  const selectedPropertyType = useMemo(() => getPropertyTypeOption(values.propertyType), [values.propertyType])
  const previewSlug = useMemo(() => createSlug(values.title), [values.title])

  const allAmenities = useMemo(() => {
    return Array.from(new Set([...values.selectedAmenities, ...parseAmenities(values.customAmenities)]))
  }, [values.customAmenities, values.selectedAmenities])

  function updateField<Key extends keyof ListingFormValues>(key: Key, value: ListingFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handlePropertyTypeChange(nextType: PropertyType) {
    const nextConfig = getPropertyTypeConfig(nextType)

    setValues((current) => ({
      ...current,
      propertyType: nextType,
      propertySubtype: nextConfig.subtypeOptions[0],
      selectedAmenities: [],
      bedrooms: nextConfig.supportsRooms ? current.bedrooms : '',
      bathrooms: nextConfig.supportsRooms ? current.bathrooms : '',
    }))

    setError(null)
    setSaveMessage(null)
  }

  function toggleAmenity(amenity: string) {
    setValues((current) => {
      const isSelected = current.selectedAmenities.includes(amenity)

      return {
        ...current,
        selectedAmenities: isSelected
          ? current.selectedAmenities.filter((item) => item !== amenity)
          : [...current.selectedAmenities, amenity],
      }
    })
  }

  async function handleGenerateDescription() {
    setError(null)
    setSaveMessage(null)
    setIsGenerating(true)

    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          address: values.address,
          propertyType: `${selectedPropertyType.label} - ${values.propertySubtype}`,
          type: values.transactionType,
          price: parseOptionalNumber(values.price),
          area: parseOptionalNumber(values.area),
          bedrooms: propertyConfig.supportsRooms ? parseOptionalNumber(values.bedrooms) : undefined,
          bathrooms: propertyConfig.supportsRooms ? parseOptionalNumber(values.bathrooms) : undefined,
          amenities: allAmenities,
        }),
      })

      const payload = (await response.json()) as { error?: string; data?: { description: string } }

      if (!response.ok || !payload.data) {
        setError(payload.error ?? 'Không thể tạo mô tả lúc này.')
        return
      }

      updateField('description', payload.data.description)
    } catch {
      setError('Không thể kết nối tới dịch vụ AI.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleSaveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaveMessage(
      `Đã lưu bản nháp cho ${selectedPropertyType.label.toLowerCase()} theo nhu cầu ${values.transactionType === 'sell' ? 'bán' : 'cho thuê'}.`
    )
  }

  return (
    <Dialog>
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle>Tạo tin đăng theo đúng loại bất động sản</CardTitle>
            <CardDescription>
              Chọn loại hình, nhu cầu, phân loại chi tiết và các điểm nổi bật phù hợp để tin đăng sát thực tế hơn ngay từ đầu.
            </CardDescription>
          </div>

          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Xem preview
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSaveDraft}>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Loại bất động sản</p>
                <p className="mt-1 text-sm text-slate-500">
                  Mỗi loại hình sẽ có nhóm phân loại và điểm nổi bật riêng để bạn nhập nhanh hơn.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {propertyTypeOptions.map((option) => {
                  const Icon = propertyTypeIcons[option.value]

                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={values.propertyType === option.value ? 'default' : 'outline'}
                      className="h-auto min-h-20 justify-between whitespace-normal px-4 py-3 text-left"
                      onClick={() => handlePropertyTypeChange(option.value)}
                    >
                      <div>
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="mt-1 text-xs opacity-80">{option.description}</p>
                      </div>
                      <Icon className="h-4 w-4 shrink-0" />
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Nhu cầu giao dịch</p>
                <p className="mt-1 text-sm text-slate-500">Chọn đúng nhu cầu để cách viết mô tả và lời kêu gọi hành động sát hơn.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {listingIntentOptions.map((option) => {
                  const Icon = listingIntentIcons[option.value]

                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={values.transactionType === option.value ? 'default' : 'outline'}
                      className="h-auto min-h-16 justify-between whitespace-normal px-4 py-3 text-left"
                      onClick={() => updateField('transactionType', option.value)}
                    >
                      <div>
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="mt-1 text-xs opacity-80">{option.description}</p>
                      </div>
                      <Icon className="h-4 w-4 shrink-0" />
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="title">
                  Tiêu đề tin đăng
                </label>
                <Input
                  id="title"
                  value={values.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="Ví dụ: Đất thổ cư mặt tiền gần chợ, sổ riêng"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="address">
                  Địa chỉ
                </label>
                <Input
                  id="address"
                  value={values.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="price">
                  Giá (VND)
                </label>
                <Input
                  id="price"
                  inputMode="numeric"
                  value={values.price}
                  onChange={(event) => updateField('price', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="area">
                  Diện tích (m²)
                </label>
                <Input
                  id="area"
                  inputMode="decimal"
                  value={values.area}
                  onChange={(event) => updateField('area', event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">{propertyConfig.subtypeLabel}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Chọn nhóm sát nhất với tài sản để nội dung trang giới thiệu đúng ngữ cảnh hơn.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {propertyConfig.subtypeOptions.map((subtype) => (
                  <Button
                    key={subtype}
                    type="button"
                    variant={values.propertySubtype === subtype ? 'default' : 'outline'}
                    onClick={() => updateField('propertySubtype', subtype)}
                  >
                    {subtype}
                    {values.propertySubtype === subtype ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>

            {propertyConfig.supportsRooms ? (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="bedrooms">
                    Số phòng ngủ
                  </label>
                  <Input
                    id="bedrooms"
                    inputMode="numeric"
                    value={values.bedrooms}
                    onChange={(event) => updateField('bedrooms', event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="bathrooms">
                    Số phòng tắm
                  </label>
                  <Input
                    id="bathrooms"
                    inputMode="numeric"
                    value={values.bathrooms}
                    onChange={(event) => updateField('bathrooms', event.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Loại hình này không cần số phòng</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Với tin đất, bạn nên tập trung vào pháp lý, loại đất, mặt tiền, đường vào và tiện ích xung quanh.
                    </p>
                  </div>
                  <LandPlot className="mt-1 h-5 w-5 text-slate-500" />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Điểm nổi bật theo loại tài sản</p>
                <p className="mt-1 text-sm text-slate-500">
                  Chọn nhanh những điểm bạn muốn nhấn mạnh trên trang giới thiệu và trong mô tả AI.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {propertyConfig.presetAmenities.map((amenity) => {
                  const selected = values.selectedAmenities.includes(amenity)

                  return (
                    <Button
                      key={amenity}
                      type="button"
                      variant={selected ? 'default' : 'outline'}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                      {selected ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="customAmenities">
                Bổ sung từ khóa riêng
              </label>
              <Input
                id="customAmenities"
                value={values.customAmenities}
                onChange={(event) => updateField('customAmenities', event.target.value)}
                placeholder="Nhập thêm và ngăn cách bằng dấu phẩy, ví dụ: sổ riêng, view công viên"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Mô tả bằng AI</p>
                  <p className="text-sm text-slate-500">
                    AI sẽ dựa trên loại hình, nhu cầu, phân loại chi tiết và các điểm nổi bật bạn vừa chọn.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Đang tạo mô tả' : 'Tạo mô tả bằng AI'}
                  {isGenerating ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Textarea
                value={values.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Mô tả sẽ xuất hiện tại đây..."
                className="min-h-40"
              />
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {saveMessage ? <p className="text-sm text-emerald-600">{saveMessage}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="sm:w-auto">
                  Xem preview
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <Button type="submit" className="sm:w-auto">
                Lưu bản nháp
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DialogContent className="h-[90vh] max-w-7xl overflow-hidden border-none p-0 shadow-2xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle>Xem trước landing page</DialogTitle>
          <DialogDescription>
            Preview này mô phỏng giao diện public page để bạn kiểm tra nhanh nội dung trước khi lưu bản nháp.
          </DialogDescription>
        </DialogHeader>

        <div className="h-full overflow-y-auto bg-slate-100 p-4 md:p-6">
          <CreateListingPreview
            supportsRooms={propertyConfig.supportsRooms}
            showHeader={false}
            values={{
              ...values,
              amenities: allAmenities,
              title: values.title || 'Tiêu đề tin đăng đang cập nhật',
              address: values.address || 'Địa chỉ đang cập nhật',
              propertySubtype: values.propertySubtype || previewSlug || 'Phân loại đang cập nhật',
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
