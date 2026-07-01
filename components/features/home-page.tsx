import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Check,
  House,
  LayoutDashboard,
  ListPlus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'

import { ListingCard } from '@/components/features/listing-card'
import { LocaleSwitcher } from '@/components/primitives/locale-switcher'
import { SectionLabel } from '@/components/primitives/section-label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Locale } from '@/i18n/routing'
import { getLocaleMessages } from '@/lib/messages'
import { pricingPlans } from '@/lib/mock-data'
import type { Listing, PricingPlan } from '@/types/listing'

const valuePropIcons = [House, Sparkles, Users, BarChart3] as const

interface HomePageProps {
  locale: Locale
  featuredListing: Listing
  listings: Listing[]
}

export function HomePage({ locale, featuredListing, listings }: HomePageProps) {
  const content = getLocaleMessages(locale).HomePage
  const localizedPricingPlans = pricingPlans.map((plan) => ({
    ...plan,
    ...content.pricingPlans[plan.id as keyof typeof content.pricingPlans],
  })) as PricingPlan[]

  return (
    <main lang={locale}>
      <section className="relative overflow-hidden border-b border-(--border) bg-white">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <header className="flex flex-col gap-4 rounded-full border border-(--border) bg-white/90 px-5 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <House className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-950">ListingKit</p>
                <p className="text-xs text-slate-500">{content.brandTagline}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <a href="#features">{content.nav.features}</a>
                <a href="#reviews">{content.nav.reviews}</a>
                <a href="#pricing">{content.nav.pricing}</a>
                <Link href="/dashboard">{content.nav.dashboard}</Link>
                <Link href={`/${locale}/login`}>{content.nav.login}</Link>
                <Link href="/dashboard/listings/new">
                  <Button size="sm">
                    {content.nav.createListing}
                    <ListPlus className="h-4 w-4" />
                  </Button>
                </Link>
              </nav>
              <LocaleSwitcher currentLocale={locale} pathResolver={(targetLocale) => `/${targetLocale}`} />
            </div>
          </header>

          <div className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div className="space-y-8">
              <SectionLabel>{content.badge}</SectionLabel>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-6xl">
                  {content.heroTitle}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">{content.heroDescription}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard/listings/new">
                  <Button size="lg">
                    {content.primaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/l/${featuredListing.slug}`}>
                  <Button size="lg" variant="outline">
                    {content.secondaryCta}
                    <Search className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {content.launchSteps.map((step, index) => (
                  <div key={step} className="rounded-3xl border border-(--border) bg-slate-50 p-5">
                    <p className="text-2xl font-bold text-sky-700">0{index + 1}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-slate-950 bg-slate-950 text-white">
              <CardHeader>
                <CardTitle className="text-white">{content.snapshotTitle}</CardTitle>
                <CardDescription className="text-slate-300">{content.snapshotDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.snapshotStats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl bg-white/10 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-300">{stat.label}</p>
                        <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        <BarChart3 className="h-5 w-5 text-sky-300" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{stat.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <SectionLabel>{content.featuresLabel}</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
            {content.featuresTitle}
          </h2>
          <p className="text-lg leading-8 text-slate-600">{content.featuresDescription}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {content.valueProps.map((item, index) => {
            const Icon = valuePropIcons[index]

            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="border-y border-(--border) bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-4">
              <SectionLabel>{content.sampleListingsLabel}</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                {content.sampleListingsTitle}
              </h2>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                {content.openDashboard}
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <SectionLabel>{content.reviewsLabel}</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
            {content.reviewsTitle}
          </h2>
          <p className="text-lg leading-8 text-slate-600">{content.reviewsDescription}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {content.reviews.map((review) => (
            <Card key={review.name}>
              <CardHeader>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={`${review.name}-${index}`}>★</span>
                  ))}
                </div>
                <CardTitle className="text-xl">{review.name}</CardTitle>
                <CardDescription>{review.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-8 text-slate-600">“{review.quote}”</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <SectionLabel>{content.pricingLabel}</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
            {content.pricingTitle}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {localizedPricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.highlighted ? 'border-slate-950 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.6)]' : ''}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>{plan.name}</span>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                      {content.recommended}
                    </span>
                  ) : null}
                </CardTitle>
                <p className="text-3xl font-semibold text-slate-950">{plan.priceLabel}</p>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-5 text-sm font-medium text-slate-500">
                  {content.pricingLimit}: {plan.listingLimit}
                </p>
                <ul className="space-y-3 text-sm text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-slate-100 p-1">
                        <Check className="h-3.5 w-3.5 text-slate-700" />
                      </div>
                      <span className={feature.included ? '' : 'text-slate-400'}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <SectionLabel>{content.nextLabel}</SectionLabel>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">{content.nextTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            {content.nextDescription}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                {content.goToDashboard}
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/listings/new">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                {content.continueBuild}
                <ListPlus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
