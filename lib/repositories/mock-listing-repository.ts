import { randomUUID } from 'node:crypto'

import {
    buildListingDraftRecord,
    mapListingDomainToRecord,
    mapListingRecordToDomain,
    normalizeListingDraftInput,
    type ListingRecordWithAgent,
} from '@/lib/db/schema/listing-record'
import { dashboardStats, sampleListings } from '@/lib/mock-data'
import { createSlug } from '@/lib/utils'
import type { DashboardStat, Listing, ListingDraftInput } from '@/types/listing'

import type { ListingReadRepository } from './listing-repository'

const listingStore: ListingRecordWithAgent[] = sampleListings.map(mapListingDomainToRecord)

function cloneListing(record: ListingRecordWithAgent): Listing {
  return mapListingRecordToDomain({
    ...record,
    amenities: [...record.amenities],
    highlights: [...record.highlights],
    images: [...record.images],
    source_breakdown: record.source_breakdown.map((item) => ({ ...item })),
    agent: { ...record.agent },
  })
}

function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug
  let attempt = 1

  while (listingStore.some((record) => record.slug === slug)) {
    slug = `${baseSlug}-${attempt}`
    attempt += 1
  }

  return slug
}

export class MockListingRepository implements ListingReadRepository {
  async listAll() {
    return listingStore
      .slice()
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .map(cloneListing)
  }

  async listPublic() {
    return listingStore
      .filter((record) => record.status === 'active')
      .sort((left, right) => Number(right.featured) - Number(left.featured) || right.created_at.localeCompare(left.created_at))
      .map(cloneListing)
  }

  async listFeatured(limit = 3) {
    return listingStore
      .filter((record) => record.status === 'active')
      .sort((left, right) => Number(right.featured) - Number(left.featured) || right.created_at.localeCompare(left.created_at))
      .slice(0, limit)
      .map(cloneListing)
  }

  async listByAgent(userId: string) {
    return listingStore
      .filter((record) => record.user_id === userId)
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .map(cloneListing)
  }

  async getBySlug(slug: string) {
    const record = listingStore.find((item) => item.slug === slug)
    return record ? cloneListing(record) : null
  }

  async createDraft(input: ListingDraftInput & { slug: string }) {
    const normalized = normalizeListingDraftInput(input)
    const slug = ensureUniqueSlug(input.slug || createSlug(normalized.title))
    const record = buildListingDraftRecord(
      {
        id: randomUUID(),
        slug,
        user_id: normalized.userId,
        title: normalized.title,
        description: normalized.description,
        price: normalized.price ?? 0,
        area: normalized.area ?? 0,
        bedrooms: normalized.bedrooms ?? null,
        bathrooms: normalized.bathrooms ?? null,
        address: normalized.address,
        district: normalized.district,
        city: normalized.city,
        type: normalized.type,
        property_type: normalized.propertyType,
        property_subtype: normalized.propertySubtype ?? null,
        amenities: normalized.amenities,
        highlights: normalized.highlights,
        images: normalized.images,
        featured: false,
        created_at: new Date().toISOString(),
      },
      normalized.agent
    )

    listingStore.unshift(record)
    return cloneListing(record)
  }

  async getDashboardStats(_userId?: string): Promise<DashboardStat[]> {
    return dashboardStats.map((stat) => ({ ...stat }))
  }
}

const mockListingRepository = new MockListingRepository()

export function getMockListingRepository() {
  return mockListingRepository
}
