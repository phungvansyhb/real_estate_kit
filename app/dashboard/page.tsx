import Link from 'next/link'
import { ArrowRight, ListPlus, LogOut, Settings, Sparkles, BarChart2, Eye, Users } from 'lucide-react'

import { ListingCard } from '@/components/features/listing-card'
import { SectionLabel } from '@/components/primitives/section-label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { defaultLocale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'
import { signOutAction } from '@/lib/services/auth-actions'
import { getDashboardStats, listDashboardListings } from '@/lib/services/listing-service'
import { getCurrentUser } from '@/lib/supabase/auth'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const [stats, listings] = await Promise.all([getDashboardStats(user?.id), listDashboardListings(user?.id)])
  const content = getLocaleMessages(defaultLocale).Dashboard

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <SectionLabel>{content.label}</SectionLabel>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{content.title}</h1>
          <p className="text-sm text-slate-600">{content.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-sm text-slate-600">{user?.email}</div>
          <Link href="/dashboard/listings/new">
            <Button>
              <ListPlus className="h-4 w-4" />
              {content.actions.createListing}
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline">
              <Settings className="h-4 w-4" />
              {content.actions.profile}
            </Button>
          </Link>
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={defaultLocale} />
            <Button variant="outline" type="submit">
              <LogOut className="h-4 w-4" />
              {content.actions.signOut}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const icons = [BarChart2, Eye, Users]
          const Icon = icons[i] ?? BarChart2
          return (
            <Card key={stat.label}>
              <CardHeader className="flex items-center justify-between pb-3">
                <div>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                </div>
                <div className="rounded-xl bg-slate-100 p-2">
                  <Icon className="h-5 w-5 text-sky-700" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{content.recentListings.title}</CardTitle>
                <CardDescription>{content.recentListings.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <input placeholder="Search listings" className="rounded-md border border-slate-200 px-3 py-2 text-sm" />
                <Link href="/dashboard/listings/new">
                  <Button size="sm" className="inline-flex items-center gap-2">
                    <ListPlus className="h-4 w-4" />
                    New
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 xl:grid-cols-2">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-50 p-3">
                  <Sparkles className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <CardTitle>{content.aiCard.title}</CardTitle>
                  <CardDescription className="text-slate-600">{content.aiCard.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/listings/new">
                <Button variant="secondary" className="w-full">
                  {content.aiCard.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/profile">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  {content.actions.profile}
                </Button>
              </Link>
              <Link href="/dashboard/listings/new">
                <Button className="w-full justify-start">
                  <ListPlus className="h-4 w-4 mr-2" />
                  {content.actions.createListing}
                </Button>
              </Link>
              <form action={signOutAction}>
                <input type="hidden" name="locale" value={defaultLocale} />
                <Button variant="outline" className="w-full justify-start" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  {content.actions.signOut}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
