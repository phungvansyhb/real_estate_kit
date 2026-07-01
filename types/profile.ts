import type { AgentProfile } from './listing'

export interface ProfileUpdateInput {
  userId: string
  email: string
  name: string
  phone: string
  company: string
  bio: string
  avatarFile?: File | null
}

export interface PersistProfileInput {
  userId: string
  email: string
  name: string
  phone: string
  company: string
  bio: string
  avatarUrl?: string | null
  plan: AgentProfile['plan']
}
