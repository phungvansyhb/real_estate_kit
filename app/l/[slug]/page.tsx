import { redirect } from 'next/navigation'

import { defaultLocale } from '@/lib/i18n'
import { buildLocalizedPath } from '@/lib/seo'

interface LegacyListingPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LegacyListingPage({ params }: LegacyListingPageProps) {
  const { slug } = await params

  redirect(buildLocalizedPath(defaultLocale, `/l/${slug}`))
}
