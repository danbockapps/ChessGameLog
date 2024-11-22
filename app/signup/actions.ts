'use server'

import {createServerClient} from '../lib/supabase/server'

export async function signup(email: string, password: string) {
  const supabase = createServerClient()

  const {error} = await supabase.auth.signUp({email, password})

  if (error) {
    throw new Error(error.message)
  }
}
