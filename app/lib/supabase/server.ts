import {Database} from '@/app/database.types'
import {createServerClient as createServerClientSupabase} from '@supabase/ssr'
import {cookies} from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()

  return createServerClientSupabase<Database>(
    process.env.INTERNAL_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
