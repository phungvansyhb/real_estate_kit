export type ListingStatus = 'active' | 'sold' | 'rented' | 'draft'
export type ListingIntent = 'sell' | 'rent'
export type PropertyType =
  | 'apartment'
  | 'house'
  | 'land'
  | 'villa'
  | 'shophouse'

export interface AgentProfile {
  id: string
  name: string
  phone: string
  email: string
  company: string
  bio: string
  avatarUrl: string
  plan: 'free' | 'starter' | 'pro'
}

export interface Listing {
  id: string
  slug: string
  title: string
  description: string
  price: number
  area: number
  bedrooms?: number
  bathrooms?: number
  address: string
  district: string
  city: string
  type: ListingIntent
  propertyType: PropertyType
  propertySubtype?: string
  amenities: string[]
  highlights?: string[]
  images: string[]
  status: ListingStatus
  viewCount: number
  leadsCount: number
  sourceBreakdown: Array<{
    label: string
    value: number
  }>
  featured: boolean
  createdAt: string
  agent: AgentProfile
}

export interface ListingDraftInput {
  userId: string
  agent: AgentProfile
  title: string
  description: string
  price?: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  address: string
  district: string
  city: string
  type: ListingIntent
  propertyType: PropertyType
  propertySubtype?: string
  amenities: string[]
  highlights: string[]
  images: string[]
}

export interface DashboardStat {
  label: string
  value: string
  description: string
}

export interface PlanFeature {
  name: string
  included: boolean
}

export interface PricingPlan {
  id: 'free' | 'starter' | 'pro'
  name: string
  priceLabel: string
  description: string
  listingLimit: string
  highlighted?: boolean
  features: PlanFeature[]
}
