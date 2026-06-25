'use client'

import { useState } from 'react'
import { LoaderCircle, QrCode } from 'lucide-react'

import type { Locale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

interface QrDownloadButtonProps {
  slug: string
  locale?: Locale
  label?: string
}

export function QrDownloadButton({ slug, locale = 'vi', label = 'Tải QR code' }: QrDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  async function handleDownload() {
    setIsDownloading(true)

    try {
      const response = await fetch(`/api/qr/${slug}?locale=${locale}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `${slug}-${locale}.png`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={handleDownload} variant="outline" disabled={isDownloading}>
      {label}
      {isDownloading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <QrCode className="h-4 w-4" />
      )}
    </Button>
  )
}
