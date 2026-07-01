import type { ListingReadRepository } from '../repositories/listing-repository'
import { getMockListingRepository } from '../repositories/mock-listing-repository'
import { getSupabaseListingRepository } from '../repositories/supabase-listing-repository'

import { createSlug } from '@/lib/utils'
import type { DashboardStat, Listing, ListingDraftInput } from '@/types/listing'

function getRepository(repository?: ListingReadRepository) {
  if (repository) {
    return repository
  }

  const provider = process.env.LISTING_DATA_PROVIDER ?? 'mock'

  if (provider === 'supabase') {
    return getSupabaseListingRepository()
  }

  return getMockListingRepository()
}

export async function listPublicListings(repository?: ListingReadRepository): Promise<Listing[]> {
  return getRepository(repository).listPublic()
}

export async function listHomepageListings(repository?: ListingReadRepository): Promise<Listing[]> {
  return getRepository(repository).listFeatured(3)
}

export async function getFeaturedListing(repository?: ListingReadRepository): Promise<Listing | null> {
  const listings = await getRepository(repository).listFeatured(1)
  return listings[0] ?? null
}

export async function getListingBySlug(slug: string, repository?: ListingReadRepository): Promise<Listing | null> {
  return getRepository(repository).getBySlug(slug)
}

export async function listListingSlugs(repository?: ListingReadRepository): Promise<string[]> {
  const listings = await getRepository(repository).listPublic()
  return listings.map((listing) => listing.slug)
}

export async function listDashboardListings(userId?: string, repository?: ListingReadRepository): Promise<Listing[]> {
  const activeRepository = getRepository(repository)

  if (!userId) {
    return activeRepository.listAll()
  }

  return activeRepository.listByAgent(userId)
}

export async function getDashboardStats(userId?: string, repository?: ListingReadRepository): Promise<DashboardStat[]> {
  return getRepository(repository).getDashboardStats(userId)
}

export async function createListingDraft(
  input: ListingDraftInput,
  repository?: ListingReadRepository
): Promise<Listing> {
  const activeRepository = getRepository(repository)

  return activeRepository.createDraft({
    ...input,
    slug: createSlug(input.title),
  })
}
