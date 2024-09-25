'use server'

import {Database} from '@/app/database.types'
import {createServerClient} from '@/app/lib/supabase/server'
import {revalidatePath} from 'next/cache'

const importChesscomGames = async (
  collectionId: string,
  lastRefreshed: Date | null,
  username: string,
) => {
  console.time('insertChesscomGames')
  const supabase = createServerClient()

  const currentMonth = new Date().getMonth()
  const mm = `${currentMonth < 9 ? '0' : ''}${currentMonth + 1}`
  const yyyy = new Date().getFullYear()

  if (currentMonth === lastRefreshed?.getMonth() && yyyy === lastRefreshed?.getFullYear()) {
    // Just one rest call is needed
    const result = await fetch(`https://api.chess.com/pub/player/${username}/games/${yyyy}/${mm}`)
    const data = (await result.json()) as {games: Game[]}

    console.timeLog('insertChesscomGames', `fetched ${data.games.length} games`)

    await supabase.from('games').insert(
      data.games
        .filter((g) => new Date(g.end_time * 1000) > lastRefreshed)
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

export default importChesscomGames
