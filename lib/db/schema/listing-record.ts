import type { AgentProfile, Listing, ListingDraftInput, ListingIntent, ListingStatus, PropertyType } from '@/types/listing'

export interface ListingRecord {
  id: string
  user_id: string
  slug: string
  title: string
  description: string
  price: number
  area: number
  bedrooms: number | null
  bathrooms: number | null
  address: string
  district: string
  city: string
  type: ListingIntent
  property_type: PropertyType
  property_subtype: string | null
  amenities: string[]
  highlights: string[]
  images: string[]
  status: ListingStatus
  view_count: number
  leads_count: number
  source_breakdown: Array<{
    label: string
    value: number
  }>
  featured: boolean
  created_at: string
}

export interface ListingRecordWithAgent extends ListingRecord {
  agent: AgentProfile
}

export interface CreateListingDraftRecordInput {
  id: string
  slug: string
  user_id: string
  title: string
  description: string
  price: number
  area: number
  bedrooms: number | null
  bathrooms: number | null
  address: string
  district: string
  city: string
  type: ListingIntent
  property_type: PropertyType
  property_subtype: string | null
  amenities: string[]
  highlights: string[]
  images: string[]
  featured: boolean
  created_at: string
}

export function mapListingRecordToDomain(record: ListingRecordWithAgent): Listing {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    price: record.price,
    area: record.area,
    bedrooms: record.bedrooms ?? undefined,
    bathrooms: record.bathrooms ?? undefined,
    address: record.address,
    district: record.district,
    city: record.city,
    type: record.type,
    propertyType: record.property_type,
    propertySubtype: record.property_subtype ?? undefined,
    amenities: record.amenities,
    highlights: record.highlights,
    images: record.images,
    status: record.status,
    viewCount: record.view_count,
    leadsCount: record.leads_count,
    sourceBreakdown: record.source_breakdown,
    featured: record.featured,
    createdAt: record.created_at,
    agent: record.agent,
  }
}

export function mapListingDomainToRecord(listing: Listing): ListingRecordWithAgent {
  return {
    id: listing.id,
    user_id: listing.agent.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    area: listing.area,
    bedrooms: listing.bedrooms ?? null,
    bathrooms: listing.bathrooms ?? null,
    address: listing.address,
    district: listing.district,
    city: listing.city,
    type: listing.type,
    property_type: listing.propertyType,
    property_subtype: listing.propertySubtype ?? null,
    amenities: listing.amenities,
    highlights: listing.highlights ?? [],
    images: listing.images,
    status: listing.status,
    view_count: listing.viewCount,
    leads_count: listing.leadsCount,
    source_breakdown: listing.sourceBreakdown,
    featured: listing.featured,
    created_at: listing.createdAt,
    agent: listing.agent,
  }
}

export function buildListingDraftRecord(input: CreateListingDraftRecordInput, agent: AgentProfile): ListingRecordWithAgent {
  return {
    ...input,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    property_subtype: input.property_subtype,
    amenities: input.amenities,
    highlights: input.highlights,
    images: input.images,
    status: 'draft',
    view_count: 0,
    leads_count: 0,
    source_breakdown: [],
    agent,
  }
}

export function normalizeListingDraftInput(input: ListingDraftInput) {
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    address: input.address.trim(),
    district: input.district.trim(),
    city: input.city.trim(),
    propertySubtype: input.propertySubtype?.trim() || undefined,
    amenities: input.amenities.map((item) => item.trim()).filter(Boolean),
    highlights: input.highlights.map((item) => item.trim()).filter(Boolean),
    images: input.images.map((item) => item.trim()).filter(Boolean),
  }
}
