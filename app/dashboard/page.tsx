import Link from 'next/link'
import { ArrowLeft, ArrowRight, ListPlus, Sparkles } from 'lucide-react'

import { ListingCard } from '@/components/features/listing-card'
import { SectionLabel } from '@/components/primitives/section-label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardStats, sampleListings } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <SectionLabel>Bảng điều khiển</SectionLabel>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Không gian làm việc của môi giới</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Theo dõi hiệu quả tin đăng, nắm các chỉ số quan trọng và tạo tin mới thật nhanh ngay trong một nơi.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard/listings/new">
            <Button>
              Tạo tin đăng mới
              <ListPlus className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/vi">
            <Button variant="outline">
              Về trang giới thiệu
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-3">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tin đăng gần đây</CardTitle>
            <CardDescription>
              Theo dõi nhanh các tin đang chạy tốt để ưu tiên chăm khách và cập nhật nội dung khi cần.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 xl:grid-cols-2">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-950 bg-slate-950 text-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Sparkles className="h-5 w-5 text-sky-300" />
                </div>
                <div>
                  <CardTitle className="text-white">Soạn mô tả với AI</CardTitle>
                  <CardDescription className="text-slate-300">
                    Tạo mô tả bất động sản từ thông tin bạn nhập và chỉnh lại ngay trên màn hình tạo tin.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/listings/new">
                <Button variant="secondary" className="w-full">
                  Mở màn tạo tin
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Các phần đã sẵn sàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-7 text-slate-600">
                <li>• Trang chủ giới thiệu dịch vụ và bảng giá rõ ràng.</li>
                <li>• Bảng điều khiển hiển thị KPI và thẻ tin đăng.</li>
                <li>• Biểu mẫu tạo tin kèm gợi ý mô tả bằng AI.</li>
                <li>• Trang tin công khai, tải mã QR và nhận yêu cầu xem nhà.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
