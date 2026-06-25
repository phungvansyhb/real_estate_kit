'use client'

import { useState } from 'react'
import { LoaderCircle, SendHorizonal } from 'lucide-react'

import type { Locale } from '@/lib/i18n'
import { listingPageContent } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface LeadFormProps {
  listingId: string
  locale?: Locale
}

export function LeadForm({ listingId, locale = 'vi' }: LeadFormProps) {
  const content = listingPageContent[locale]
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsPending(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          name,
          phone,
          note,
          preferredTime,
          source: 'direct',
          locale,
        }),
      })

      const payload = (await response.json()) as { error?: string; data?: { message: string } }

      if (!response.ok) {
        setError(payload.error ?? content.genericError)
        return
      }

      setSuccess(payload.data?.message ?? content.success)
      setName('')
      setPhone('')
      setNote('')
      setPreferredTime('')
    } catch {
      setError(content.genericError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.leadTitle}</CardTitle>
        <CardDescription>{content.leadDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="lead-name">
              {content.fullName}
            </label>
            <Input
              id="lead-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={locale === 'vi' ? 'Nguyễn Văn A' : 'John Smith'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="lead-phone">
              {content.phone}
            </label>
            <Input
              id="lead-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0901234567"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="lead-time">
              {content.preferredTime}
            </label>
            <Input
              id="lead-time"
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value)}
              placeholder={locale === 'vi' ? 'Ví dụ: 19h tối thứ Bảy' : 'Example: Saturday at 7 PM'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="lead-note">
              {content.note}
            </label>
            <Textarea
              id="lead-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={locale === 'vi' ? 'Tôi muốn xem thêm pháp lý và phí quản lý' : 'I would like to review legal docs and maintenance fees'}
            />
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? content.submitting : content.submit}
            {isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
