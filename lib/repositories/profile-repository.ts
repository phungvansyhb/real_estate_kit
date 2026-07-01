import type { AgentProfile } from '@/types/listing'
import type { PersistProfileInput } from '@/types/profile'

export interface ProfileRepository {
  getById(userId: string): Promise<AgentProfile | null>
  save(input: PersistProfileInput): Promise<AgentProfile>
}

export type ProfileReadRepository = ProfileRepository
