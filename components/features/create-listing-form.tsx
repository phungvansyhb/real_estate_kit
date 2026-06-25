'use client'

import { useMemo, useState } from 'react'
import { LoaderCircle, Save, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createSlug, formatCurrency } from '@/lib/utils'

const initialState = {
  title: 'Căn hộ 2PN gần Metro An Phú',
  address: 'Xa lộ Hà Nội, Phường An Phú, TP. Hồ Chí Minh',
  price: '4200000000',
  area: '72',
  bedrooms: '2',
  bathrooms: '2',
  propertyType: 'căn hộ',
  transactionType: 'bán',
  amenities: 'Metro, hồ bơi, gym, trường học',
  description: '',
}

export function CreateListingForm() {
  const [values, setValues] = useState(initialState)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const previewSlug = useMemo(() => createSlug(values.title), [values.title])

  function updateField<Key extends keyof typeof initialState>(key: Key, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
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
          propertyType: values.propertyType,
          type: values.transactionType === 'bán' ? 'sell' : 'rent',
          price: Number(values.price),
          area: Number(values.area),
          bedrooms: Number(values.bedrooms),
          bathrooms: Number(values.bathrooms),
          amenities: values.amenities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
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
    setSaveMessage('Đã lưu bản nháp thành công. Bạn có thể tiếp tục chỉnh nội dung trước khi xuất bản.')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>Tạo tin đăng đầu tiên</CardTitle>
          <CardDescription>
            Nhập thông tin cốt lõi của bất động sản, tạo mô tả bằng AI và xem trước trang giới thiệu ngay trên cùng màn hình.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSaveDraft}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="title">
                  Tiêu đề tin đăng
                </label>
                <Input
                  id="title"
                  value={values.title}
                  onChange={(event) => updateField('title', event.target.value)}
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="price">
                  Giá (VND)
                </label>
                <Input
                  id="price"
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
                  value={values.area}
                  onChange={(event) => updateField('area', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="bedrooms">
                  Số phòng ngủ
                </label>
                <Input
                  id="bedrooms"
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
                  value={values.bathrooms}
                  onChange={(event) => updateField('bathrooms', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="propertyType">
                  Loại BĐS
                </label>
                <Input
                  id="propertyType"
                  value={values.propertyType}
                  onChange={(event) => updateField('propertyType', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="transactionType"
                >
                  Nhu cầu
                </label>
                <Input
                  id="transactionType"
                  value={values.transactionType}
                  onChange={(event) => updateField('transactionType', event.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="amenities">
                  Tiện ích nổi bật
                </label>
                <Input
                  id="amenities"
                  value={values.amenities}
                  onChange={(event) => updateField('amenities', event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Mô tả bằng AI</p>
                  <p className="text-sm text-slate-500">
                    Nhấn nút để nhận một đoạn giới thiệu gợi ý dựa trên thông tin căn nhà bạn vừa nhập.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Đang tạo...' : 'Tạo mô tả bằng AI'}
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

            <Button type="submit">
              Lưu bản nháp
              <Save className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-950 text-white">
        <CardHeader>
          <CardTitle className="text-white">Xem trước trang giới thiệu</CardTitle>
          <CardDescription className="text-slate-300">
            Kiểm tra nội dung cốt lõi trước khi chia sẻ cho khách hàng.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Đường dẫn công khai</p>
            <p className="mt-2 text-base font-medium">listingkit.vn/l/{previewSlug}</p>
          </div>

          <div>
            <p className="text-sm text-slate-300">Tiêu đề</p>
            <p className="mt-2 text-2xl font-semibold leading-tight">{values.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Giá</p>
              <p className="mt-2 text-lg font-semibold">
                {values.price ? formatCurrency(Number(values.price)) : 'Chưa nhập'}
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Diện tích</p>
              <p className="mt-2 text-lg font-semibold">{values.area || '0'} m²</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Địa chỉ</p>
            <p className="mt-2 leading-7 text-slate-100">{values.address}</p>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Mô tả</p>
            <p className="mt-2 leading-7 text-slate-100">
              {values.description || 'Bấm nút AI để tạo mô tả tiếng Việt cho tin đăng này.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
