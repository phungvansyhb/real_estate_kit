import Link from 'next/link'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { defaultLocale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'

export default function NotFound() {
  const content = getLocaleMessages(defaultLocale).NotFound

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">404</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{content.title}</h1>
        <p className="text-lg leading-8 text-slate-600">{content.description}</p>
        <div className="flex justify-center gap-3">
          <Link href="/vi">
            <Button>
              {content.backHome}
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              {content.openDashboard}
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
