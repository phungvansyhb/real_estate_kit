import { buildProfileRecord, mapProfileRecordToAgentProfile } from '@/lib/db/schema/profile-record'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { PersistProfileInput } from '@/types/profile'

import type { ProfileRepository } from './profile-repository'

export class SupabaseProfileRepository implements ProfileRepository {
  private async client() {
    return createSupabaseServerClient()
  }

  async getById(userId: string) {
    const client = await this.client()
    const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle()

    if (error) {
      throw new Error(`Không thể tải hồ sơ môi giới: ${error.message}`)
    }

    if (!data) {
      return null
    }

    return mapProfileRecordToAgentProfile(data)
  }

  async save(input: PersistProfileInput) {
    const client = await this.client()
    const { data, error } = await client
      .from('profiles')
      .upsert(buildProfileRecord(input), { onConflict: 'id' })
      .select('*')
      .single()

    if (error) {
      throw new Error(`Không thể cập nhật hồ sơ môi giới: ${error.message}`)
    }

    return mapProfileRecordToAgentProfile(data)
  }
}

const supabaseProfileRepository = new SupabaseProfileRepository()

export function getSupabaseProfileRepository() {
  return supabaseProfileRepository
}
