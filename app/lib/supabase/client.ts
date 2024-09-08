import {Database} from '@/app/database.types'
import {createBrowserClient as createBrowserClientSupabase} from '@supabase/ssr'

export function createBrowserClient() {
  return createBrowserClientSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
