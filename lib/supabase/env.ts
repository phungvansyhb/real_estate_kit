function requireEnvironmentVariable(name: 'NEXT_PUBLIC_SUPABASE_URL') {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required Supabase environment variable: ${name}`)
  }

  return value
}

export function getSupabaseUrl() {
  return requireEnvironmentVariable('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabasePublishableKey() {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (publishableKey) {
    return publishableKey
  }

  const legacyAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (legacyAnonKey) {
    return legacyAnonKey
  }

  throw new Error(
    'Missing required Supabase environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
  )
}
