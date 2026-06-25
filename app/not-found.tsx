import Link from 'next/link'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">404</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Không tìm thấy tin đăng bạn đang mở.
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Đường dẫn có thể đã thay đổi hoặc tin đăng này hiện không còn hiển thị.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/vi">
            <Button>
              Về trang chủ
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              Mở bảng điều khiển
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
