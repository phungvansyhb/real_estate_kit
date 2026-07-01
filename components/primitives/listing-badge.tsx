import { Badge } from '@/components/ui/badge'
import type { Locale } from '@/i18n/routing'
import type { ListingStatus } from '@/types/listing'

const statusMap: Record<
  ListingStatus,
  Record<Locale, { label: string; variant: 'default' | 'secondary' | 'outline' | 'success' }>
> = {
  active: {
    vi: { label: 'Đang bán', variant: 'success' },
    en: { label: 'Available', variant: 'success' },
  },
  sold: {
    vi: { label: 'Đã bán', variant: 'secondary' },
    en: { label: 'Sold', variant: 'secondary' },
  },
  rented: {
    vi: { label: 'Đã cho thuê', variant: 'secondary' },
    en: { label: 'Rented', variant: 'secondary' },
  },
  draft: {
    vi: { label: 'Nháp', variant: 'outline' },
    en: { label: 'Draft', variant: 'outline' },
  },
}

interface ListingBadgeProps {
  status: ListingStatus
  locale?: Locale
}

export function ListingBadge({ status, locale = 'vi' }: ListingBadgeProps) {
  const config = statusMap[status][locale]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
