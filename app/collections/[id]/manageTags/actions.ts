'use server'

import {createServerClient} from '@/app/lib/supabase/server'

export const saveTagDescription = async (tagId: number, description: string) => {
  const supabase = createServerClient()
  await supabase.from('tags').update({description}).eq('id', tagId)
}
