import type { Database } from '@/types/database.types'
import type { AgentProfile } from '@/types/listing'
import type { PersistProfileInput } from '@/types/profile'

export type ProfileRecord = Database['public']['Tables']['profiles']['Row']
export type PublicAgentProfileRecord = Database['public']['Views']['public_agent_profiles']['Row']

type AgentProfileSource = Pick<ProfileRecord, 'id' | 'name' | 'phone' | 'email' | 'avatar_url' | 'company' | 'bio' | 'plan'>

type PublicAgentProfileSource = Pick<PublicAgentProfileRecord, 'id' | 'name' | 'phone' | 'avatar_url' | 'company' | 'bio' | 'plan'>

export function mapProfileRecordToAgentProfile(record: AgentProfileSource | PublicAgentProfileSource): AgentProfile {
  return {
    id: record.id ?? '',
    name: record.name ?? 'Môi giới mới',
    phone: record.phone ?? '',
    email: 'email' in record ? record.email ?? '' : '',
    company: record.company ?? 'Môi giới độc lập',
    bio: record.bio ?? '',
    avatarUrl: record.avatar_url ?? '/globe.svg',
    plan: record.plan ?? 'free',
  }
}

export function buildProfileRecord(input: PersistProfileInput): Database['public']['Tables']['profiles']['Insert'] {
  return {
    id: input.userId,
    name: input.name,
    phone: input.phone || null,
    email: input.email || null,
    avatar_url: input.avatarUrl || null,
    company: input.company || null,
    bio: input.bio || null,
    plan: input.plan,
  }
}
