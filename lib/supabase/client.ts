import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/types/database.types'

import { getSupabasePublishableKey, getSupabaseUrl } from './env'

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabasePublishableKey())
}
