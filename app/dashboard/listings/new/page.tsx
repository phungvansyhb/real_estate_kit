import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { CreateListingForm } from '@/components/features/create-listing-form'
import { SectionLabel } from '@/components/primitives/section-label'

export default function NewListingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="mb-10 space-y-4">
        <SectionLabel>Tạo tin đăng</SectionLabel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Tạo tin đăng trong một màn hình
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Điền địa chỉ, giá, diện tích, loại bất động sản, tiện ích và tạo mô tả bằng AI để có ngay một trang giới thiệu sẵn sàng gửi khách.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              Quay lại bảng điều khiển
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CreateListingForm />
    </main>
  )
}
