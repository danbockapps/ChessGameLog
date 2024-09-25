'use server'

import {Database} from '@/app/database.types'
import {createServerClient} from '@/app/lib/supabase/server'
import {revalidatePath} from 'next/cache'

export const insertChesscomGames = async (collectionId: string) => {
  console.time('insertChesscomGames')
  const supabase = createServerClient()

  const {username, last_refreshed: lastRefreshed} =
    (await supabase.from('collections').select('username,last_refreshed').eq('id', collectionId))
      .data?.[0] ?? {}

  console.timeLog('insertChesscomGames', 'fetched collection')

  const lastRefreshedDate = lastRefreshed ? new Date(lastRefreshed) : null
  const currentMonth = new Date().getMonth()
  const mm = `${currentMonth < 9 ? '0' : ''}${currentMonth + 1}`
  const yyyy = new Date().getFullYear()

  if (currentMonth === lastRefreshedDate?.getMonth() && yyyy === lastRefreshedDate?.getFullYear()) {
    // Just one rest call is needed
    const result = await fetch(`https://api.chess.com/pub/player/${username}/games/${yyyy}/${mm}`)
    const data = (await result.json()) as {games: Game[]}

    console.timeLog('insertChesscomGames', `fetched ${data.games.length} games`)

    await supabase.from('games').insert(
      data.games
        .filter((g) => new Date(g.end_time * 1000) > lastRefreshedDate)
        .map<Database['public']['Tables']['games']['Insert']>((g) => ({
          collection_id: collectionId,
          eco: g.eco,
          fen: g.fen,
          game_dttm: new Date(g.end_time * 1000).toISOString(),
          opponent:
            g.black.username.toLowerCase() === username?.toLowerCase()
              ? g.white.username
              : g.black.username,
          site: 'chess.com',
          time_control: g.time_control,
          url: g.url,
        })),
    )

    console.timeLog('insertChesscomGames', 'inserted')

    await supabase
      .from('collections')
      .update({last_refreshed: new Date().toISOString()})
      .eq('id', collectionId)

    console.timeEnd('insertChesscomGames')

    revalidatePath(`/collections/${collectionId}`)
  }
}

interface Player {
  rating: number
  result: string
  '@id': string
  username: string
  uuid: string
}

interface Game {
  url: string
  pgn: string
  time_control: string
  end_time: number
  rated: boolean
  tcn: string
  uuid: string
  initial_setup: string
  fen: string
  time_class: string
  rules: string
  white: Player
  black: Player
  eco: string
}
