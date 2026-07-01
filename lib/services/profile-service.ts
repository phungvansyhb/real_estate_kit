import { uploadProfileAvatar } from '@/lib/supabase/storage';
import type { AgentProfile } from '@/types/listing';
import type { PersistProfileInput, ProfileUpdateInput } from '@/types/profile';

import { getSupabaseProfileRepository } from '../repositories/supabase-profile-repository';

function buildFallbackProfile(input: { userId: string; email: string; fallbackName?: string | null }): AgentProfile {
  return {
    id: input.userId,
    name: input.fallbackName?.trim() || input.email.split('@')[0] || 'Môi giới mới',
    phone: '',
    email: input.email,
    company: '',
    bio: '',
    avatarUrl: '/globe.svg',
    plan: 'free',
  }
}

function normalizeText(value: string) {
  return value.trim()
}

export async function getCurrentAgentProfile(input: {
  userId: string
  email: string
  fallbackName?: string | null
}) {
  const repository = getSupabaseProfileRepository()
  const profile = await repository.getById(input.userId)

  if (profile) {
    return profile
  }

  return buildFallbackProfile(input)
}

export async function updateCurrentAgentProfile(input: ProfileUpdateInput) {
  const repository = getSupabaseProfileRepository()
  const existingProfile = await repository.getById(input.userId)
  const avatarUrl = input.avatarFile ? await uploadProfileAvatar({ userId: input.userId, file: input.avatarFile }) : existingProfile?.avatarUrl ?? null

  const payload: PersistProfileInput = {
    userId: input.userId,
    email: normalizeText(input.email),
    name: normalizeText(input.name),
    phone: normalizeText(input.phone),
    company: normalizeText(input.company),
    bio: normalizeText(input.bio),
    avatarUrl,
    plan: existingProfile?.plan ?? 'free',
  }

  return repository.save(payload)
}
