import type { Metadata } from 'next'

import { requireAuthenticatedUser } from '@/lib/services/auth-service'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAuthenticatedUser('/dashboard')

  return children
}
