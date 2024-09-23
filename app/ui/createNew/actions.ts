'use server'

import {createServerClient} from '@/app/lib/supabase/server'
import {Type} from './createNewModal'
import {revalidatePath} from 'next/cache'

export async function createCollection(type: Type, username: string, name: string) {
  const supabase = createServerClient()

  // TODO error handling
  await supabase.from('collections').insert({
    name: name.trim() || 'Untitled collection',
    site: type === 'lichess' || type === 'chess.com' ? type : null,
  })

  revalidatePath('/collections')
}
