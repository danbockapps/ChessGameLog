'use server'

import {Database} from '@/app/database.types'
import {createServerClient} from '@/app/lib/supabase/server'
import {revalidatePath} from 'next/cache'

const importChesscomGames = async (
  collectionId: string,
  lastRefreshed: Date | null,
  username: string,
) => {
  console.log('importChesscomGames')
  console.time('importChesscomGames')

  const currentDate = new Date()

  const numCurrentMonthGames = await importChesscomGamesForMonth({
    year: currentDate.getFullYear(),
    jsMonth: currentDate.getMonth(),
    username,
    collectionId,
    lastRefreshed,
  })

  if (
    (!lastRefreshed && numCurrentMonthGames < 25) ||
    currentDate.getMonth() !== lastRefreshed?.getMonth() ||
    currentDate.getFullYear() !== lastRefreshed?.getFullYear()
  ) {
    await importChesscomGamesForMonth({
      year:
        currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear(),
      jsMonth: currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1,
      username,
      collectionId,
      lastRefreshed,
    })
  }

  console.timeEnd('importChesscomGames')
  revalidatePath(`/collections/${collectionId}`)
}

interface ImportChesscomGamesForMonthProps {
  year: number
  jsMonth: number
  username: string
  collectionId: string
  lastRefreshed: Date | null
}

const importChesscomGamesForMonth = async ({
  year,
  jsMonth,
  username,
  collectionId,
  lastRefreshed,
}: ImportChesscomGamesForMonthProps) => {
  const supabase = createServerClient()
  const mm = `${jsMonth < 9 ? '0' : ''}${jsMonth + 1}`
  console.timeLog('importChesscomGames', `fetching games for ${year}-${mm}`)
  const result = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${mm}`)
  const data = (await result.json()) as {games: Game[]}
  console.timeLog('importChesscomGames', `fetched ${data.games.length} games`)

  try {
    const {error} = await supabase.from('games').upsert(
      data.games
        .filter((g) => !lastRefreshed || new Date(g.end_time * 1000) > lastRefreshed)
        .map<Database['public']['Tables']['games']['Insert']>((g) => ({
          site: 'chess.com',
          collection_id: collectionId,
          eco: g.eco,
          fen: g.fen,
          game_dttm: new Date(g.end_time * 1000).toISOString(),
          time_control: g.time_control,
          url: g.url,
          white_username: g.white.username,
          black_username: g.black.username,
          white_rating: g.white.rating,
          black_rating: g.black.rating,
          white_result: g.white.result,
          black_result: g.black.result,
        })),
      {onConflict: 'url', ignoreDuplicates: true}, // skip insert if id exists
    )

    console.timeLog('importChesscomGames', 'attempted to insert')

    if (error) {
      console.log('Error inserting games for Chess.com')
      console.error(error)
    } else {
      await supabase
        .from('collections')
        .update({last_refreshed: new Date().toISOString()})
        .eq('id', collectionId)
    }
  } catch (e) {
    console.log('Caught error inserting games for Chess.com')
    console.error(e)
  }

  return data.games.length
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
