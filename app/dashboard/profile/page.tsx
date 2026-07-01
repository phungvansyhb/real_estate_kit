import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BadgeCheck, Camera, CheckCircle2, Save, ShieldCheck, UserRound } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { defaultLocale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'
import { requireAuthenticatedUser } from '@/lib/services/auth-service'
import { updateProfileAction } from '@/lib/services/profile-actions'
import { getCurrentAgentProfile } from '@/lib/services/profile-service'

interface ProfilePageProps {
  searchParams: Promise<{
    updated?: string
    error?: string
  }>
}

function getFeedbackMessage(content: ReturnType<typeof getLocaleMessages>['DashboardProfile'], error?: string) {
  switch (error) {
    case 'invalid-form':
      return content.feedback.invalidForm
    case 'invalid-avatar-type':
      return content.feedback.invalidAvatarType
    case 'avatar-too-large':
      return content.feedback.avatarTooLarge
    case 'update-failed':
      return content.feedback.updateFailed
    default:
      return null
  }
}

export default async function DashboardProfilePage({ searchParams }: ProfilePageProps) {
  const content = getLocaleMessages(defaultLocale).DashboardProfile
  const user = await requireAuthenticatedUser('/dashboard/profile')
  const query = await searchParams
  const profile = await getCurrentAgentProfile({
    userId: user.id,
    email: user.email ?? '',
    fallbackName:
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : typeof user.user_metadata?.name === 'string'
          ? user.user_metadata.name
          : null,
  })

  const feedbackError = getFeedbackMessage(content, query.error)
  const showSuccess = query.updated === '1'

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex items-center justify-between gap-6">
        <div>
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs tracking-[0.2em] uppercase">
            {content.label}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{content.title}</h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600">{content.description}</p>
        </div>

        <Link href="/dashboard">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {content.backToDashboard}
          </Button>
        </Link>
      </div>

      {showSuccess ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{content.feedback.success}</p>
        </div>
      ) : null}

      {feedbackError ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {feedbackError}
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{content.form.title}</CardTitle>
            <CardDescription>{content.form.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="grid gap-6">
              <div className="grid gap-2 md:grid-cols-3 md:items-center">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-900">{content.form.fields.avatar}</label>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        <Image src={profile.avatarUrl} alt={profile.name} width={112} height={112} className="h-full w-full object-cover" />
                      </div>
                      <label htmlFor="avatar" className="absolute bottom-0 right-0 translate-x-1 translate-y-1 rounded-full bg-white p-2 shadow-sm hover:bg-slate-50">
                        <Camera className="h-4 w-4 text-sky-700" />
                      </label>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{content.form.avatarHint}</p>
                      <p className="mt-1 text-sm text-slate-600">{content.form.avatarFormats}</p>
                      <div className="mt-3">
                        <input
                          id="avatar"
                          name="avatar"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="block w-full cursor-pointer rounded-lg text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-3 file:py-1 file:text-sm file:font-medium file:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-900">{content.form.fields.name}</label>
                  <Input id="name" name="name" defaultValue={profile.name} placeholder={content.form.placeholders.name} required />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-900">{content.form.fields.phone}</label>
                  <Input id="phone" name="phone" defaultValue={profile.phone} placeholder={content.form.placeholders.phone} />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="company" className="text-sm font-medium text-slate-900">{content.form.fields.company}</label>
                  <Input id="company" name="company" defaultValue={profile.company} placeholder={content.form.placeholders.company} />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-900">{content.form.fields.email}</label>
                  <Input id="email" value={profile.email} readOnly className="bg-slate-50 text-slate-500" />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="bio" className="text-sm font-medium text-slate-900">{content.form.fields.bio}</label>
                  <span className="text-xs text-slate-500">{content.form.bioLimit}</span>
                </div>
                <Textarea id="bio" name="bio" defaultValue={profile.bio} maxLength={512} placeholder={content.form.placeholders.bio} className="min-h-32" />
                <p className="text-sm leading-6 text-slate-500">{content.form.bioHint}</p>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-600">{content.form.footerHint}</p>
                <Button type="submit" className="sm:min-w-48">
                  {content.form.save}
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="hidden lg:block">
          <CardHeader className="border-b bg-slate-50/60">
            <CardTitle>{content.preview.title}</CardTitle>
            <CardDescription>{content.preview.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <Image src={profile.avatarUrl} alt={profile.name} width={112} height={112} className="h-full w-full object-cover" />
                </div>
                <div className="absolute -right-2 -bottom-2">
                  <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white">{content.preview.planLabel} {profile.plan}</Badge>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-950">{profile.name}</h2>
                <p className="text-sm text-slate-600">{profile.company || content.preview.companyFallback}</p>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
                  <UserRound className="h-5 w-5 text-sky-700" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{content.preview.contactTitle}</p>
                    <p className="text-sm text-slate-600">{profile.phone || content.preview.contactFallback}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
                  <BadgeCheck className="h-5 w-5 text-violet-700" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{content.preview.bioTitle}</p>
                    <p className="text-sm text-slate-600">{profile.bio || content.preview.bioFallback}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{content.preview.accountTitle}</p>
                    <p className="text-sm text-slate-600">{profile.email || content.preview.accountFallback}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
