'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { LoaderCircle, SendHorizonal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Locale } from '@/i18n/routing'

interface LeadFormProps {
  listingId: string
  locale?: Locale
}

export function LeadForm({ listingId, locale = 'vi' }: LeadFormProps) {
  const t = useTranslations('LeadForm')
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
        setError(payload.error ?? t('genericError'))
        return
      }

      setSuccess(payload.data?.message ?? t('success'))
      setName('')
      setPhone('')
      setNote('')
      setPreferredTime('')
    } catch {
      setError(t('genericError'))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('leadTitle')}</CardTitle>
        <CardDescription>{t('leadDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="lead-name">
              {t('fullName')}
            </label>
            <Input
              id="lead-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('namePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="lead-phone">
              {t('phone')}
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
              {t('preferredTime')}
            </label>
            <Input
              id="lead-time"
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value)}
              placeholder={t('timePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="lead-note">
              {t('note')}
            </label>
            <Textarea
              id="lead-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t('notePlaceholder')}
            />
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t('submitting') : t('submit')}
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
