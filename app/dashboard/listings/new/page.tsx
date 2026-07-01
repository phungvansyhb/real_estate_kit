import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { CreateListingForm } from '@/components/features/create-listing-form'
import { SectionLabel } from '@/components/primitives/section-label'
import { defaultLocale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'

export default function NewListingPage() {
  const content = getLocaleMessages(defaultLocale).CreateListingPage

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="mb-10 space-y-4">
        <SectionLabel>{content.label}</SectionLabel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{content.title}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{content.description}</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              {content.backToDashboard}
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CreateListingForm />
    </main>
  )
}
