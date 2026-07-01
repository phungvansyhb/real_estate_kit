
import {
    buildListingDraftRecord,
    mapListingRecordToDomain,
    normalizeListingDraftInput,
    type ListingRecordWithAgent,
} from '@/lib/db/schema/listing-record'
import { mapProfileRecordToAgentProfile } from '@/lib/db/schema/profile-record'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import type { DashboardStat, ListingDraftInput } from '@/types/listing'

import type { ListingReadRepository } from './listing-repository'


type ListingRow = Database['public']['Tables']['listings']['Row']
type LeadRow = Database['public']['Tables']['leads']['Row']
type PublicAgentProfileRow = Database['public']['Views']['public_agent_profiles']['Row']



function breakdown(leads: LeadRow[]) {
  if (leads.length === 0) return []
  const counts = new Map<string, number>()
  for (const lead of leads) {
    const key = lead.source?.trim() || 'Direct'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts.entries()).map(([label, count]) => ({ label, value: Math.round((count / leads.length) * 100) }))
}

export class SupabaseListingRepository implements ListingReadRepository {
  private async client() {
    return createSupabaseServerClient()
  }

  private async enrich(rows: ListingRow[]) {
    const client = await this.client()
    const userIds = Array.from(new Set(rows.map((row) => row.user_id)))
    const listingIds = rows.map((row) => row.id)

    const [{ data: profiles, error: profilesError }, { data: leads, error: leadsError }] = await Promise.all([
      (async () => {
        if (!userIds.length) {
          return { data: [] as PublicAgentProfileRow[], error: null }
        }

        return client
          .from('public_agent_profiles')
          .select('id, name, phone, avatar_url, company, bio, plan')
          .in('id', userIds)
      })(),
      (async () => {
        if (!listingIds.length) {
          return { data: [] as LeadRow[], error: null }
        }

        return client.from('leads').select('*').in('listing_id', listingIds)
      })(),
    ])

    if (profilesError) throw new Error(`Failed to load profiles: ${profilesError.message}`)
    if (leadsError) throw new Error(`Failed to load leads: ${leadsError.message}`)

    const profileMap = new Map((profiles ?? []).flatMap((profile) => (profile.id ? [[profile.id, profile] as const] : [])))
    const leadMap = new Map<string, LeadRow[]>()
    for (const lead of leads ?? []) {
      leadMap.set(lead.listing_id, [...(leadMap.get(lead.listing_id) ?? []), lead])
    }

    return rows.flatMap((row) => {
      const profile = profileMap.get(row.user_id)
      if (!profile) return []
      const record: ListingRecordWithAgent = {
        id: row.id,
        user_id: row.user_id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        price: row.price,
        area: row.area,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        address: row.address,
        district: row.district,
        city: row.city,
        type: row.type,
        property_type: row.property_type,
        property_subtype: row.property_subtype,
        amenities: row.amenities,
        highlights: row.highlights,
        images: row.images,
        status: row.status,
        view_count: row.view_count,
        leads_count: row.leads_count,
        source_breakdown: breakdown(leadMap.get(row.id) ?? []),
        featured: row.featured,
        created_at: row.created_at,
        agent: mapProfileRecordToAgentProfile(profile),
      }
      return [mapListingRecordToDomain(record)]
    })
  }

  async listAll() {
    const client = await this.client()
    const { data, error } = await client.from('listings').select('*').order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to load listings: ${error.message}`)
    return this.enrich(data ?? [])
  }

  async listPublic() {
    const client = await this.client()
    const { data, error } = await client.from('listings').select('*').eq('status', 'active').order('featured', { ascending: false }).order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to load public listings: ${error.message}`)
    return this.enrich(data ?? [])
  }

  async listFeatured(limit = 3) {
    return (await this.listPublic()).slice(0, limit)
  }

  async listByAgent(userId: string) {
    const client = await this.client()
    const { data, error } = await client.from('listings').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to load agent listings: ${error.message}`)
    return this.enrich(data ?? [])
  }

  async getBySlug(slug: string) {
    const client = await this.client()
    const { data, error } = await client.from('listings').select('*').eq('slug', slug).maybeSingle()
    if (error) throw new Error(`Failed to load listing by slug: ${error.message}`)
    if (!data) return null
    const listings = await this.enrich([data])
    return listings[0] ?? null
  }

  async createDraft(input: ListingDraftInput & { slug: string }) {
    const client = await this.client()
    const normalized = normalizeListingDraftInput(input)
    const draft = buildListingDraftRecord(
      {
        id: crypto.randomUUID(),
        slug: input.slug,
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
    const { data, error } = await client.from('listings').insert([
      {
        user_id: draft.user_id,
        slug: draft.slug,
        title: draft.title,
        description: draft.description,
        price: draft.price,
        area: draft.area,
        bedrooms: draft.bedrooms,
        bathrooms: draft.bathrooms,
        address: draft.address,
        district: draft.district,
        city: draft.city,
        type: draft.type,
        property_type: draft.property_type,
        property_subtype: draft.property_subtype,
        amenities: draft.amenities,
        highlights: draft.highlights,
        images: draft.images,
        status: 'draft',
        view_count: 0,
        leads_count: 0,
        source_breakdown: [],
        featured: false,
      },
    ]).select('*').single()
    if (error) throw new Error(`Failed to create listing draft: ${error.message}`)
    const listings = await this.enrich([data])
    return listings[0]
  }

  async getDashboardStats(userId?: string): Promise<DashboardStat[]> {
    const listings = userId ? await this.listByAgent(userId) : await this.listAll()
    const active = listings.filter((item) => item.status === 'active').length
    const views = listings.reduce((sum, item) => sum + item.viewCount, 0)
    const leads = listings.reduce((sum, item) => sum + item.leadsCount, 0)
    const rate = views > 0 ? ((leads / views) * 100).toFixed(1) : '0.0'
    return [
      { label: 'Tin đang hiển thị', value: String(active), description: 'Số tin đang mở cho khách xem trên trang công khai' },
      { label: 'Tổng lượt xem', value: new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(views), description: 'Tổng lượng truy cập tích lũy trên các tin của bạn' },
      { label: 'Khách quan tâm mới', value: String(leads), description: 'Số khách đã để lại thông tin qua biểu mẫu liên hệ' },
      { label: 'Tỷ lệ chuyển đổi', value: `${rate}%`, description: 'Tỷ lệ lượt xem chuyển thành khách quan tâm' },
    ]
  }
}

const supabaseListingRepository = new SupabaseListingRepository()

export function getSupabaseListingRepository() {
  return supabaseListingRepository
}
