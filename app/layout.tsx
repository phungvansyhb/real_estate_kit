import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import { getBaseMetadataUrl } from '@/lib/seo'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: getBaseMetadataUrl(),
  title: 'ListingKit',
  description:
    'ListingKit helps real estate agents present every property beautifully, build trust faster, and turn interest into viewing requests.',
  applicationName: 'ListingKit',
  openGraph: {
    siteName: 'ListingKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
