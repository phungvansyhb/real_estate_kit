import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from '@/types/database.types'

import { getSupabasePublishableKey, getSupabaseUrl } from './env'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Cookies can only be mutated in Server Actions and Route Handlers.
          // Middleware is responsible for refreshing auth cookies during page requests.
        }
      },
    },
  })
}
