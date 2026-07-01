import { Badge } from '@/components/ui/badge'

interface SectionLabelProps {
  children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-sky-200 bg-sky-50 text-sky-700 w-max"
    >
      {children}
    </Badge>
  )
}
