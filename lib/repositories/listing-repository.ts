import type { DashboardStat, Listing, ListingDraftInput } from '@/types/listing'

export interface ListingRepository {
  listAll(): Promise<Listing[]>
  listPublic(): Promise<Listing[]>
  listFeatured(limit?: number): Promise<Listing[]>
  listByAgent(userId: string): Promise<Listing[]>
  getBySlug(slug: string): Promise<Listing | null>
  createDraft(input: ListingDraftInput & { slug: string }): Promise<Listing>
}

export interface ListingAnalyticsRepository {
  getDashboardStats(userId?: string): Promise<DashboardStat[]>
}

export interface ListingReadRepository extends ListingRepository, ListingAnalyticsRepository {}
