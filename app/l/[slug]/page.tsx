import { redirect } from 'next/navigation'

import { defaultLocale } from '@/i18n/routing'
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
