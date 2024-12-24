'use server'

import {createServerClient} from '@/app/lib/supabase/server'

export const saveNotes = async (gameId: number, notes: string) => {
  const supabase = createServerClient()
  await supabase.from('games').update({notes}).eq('id', gameId)
}

export const insertTag = async (name: string) => {
  const supabase = createServerClient()
  const {data} = await supabase.from('tags').insert({name}).select('id')
  return data
}

export const insertGameTag = async (tagId: number, gameId: number) => {
  const supabase = createServerClient()
  await supabase.from('game_tag').insert({tag_id: tagId, game_id: gameId})
}

export const deleteGameTags = async (gameId: number, tagIds: number[]) => {
  const supabase = createServerClient()
  await supabase.from('game_tag').delete().eq('game_id', gameId).in('tag_id', tagIds)
}
