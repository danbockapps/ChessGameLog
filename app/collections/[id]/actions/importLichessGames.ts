import {Database} from '@/app/database.types'
import {createServerClient} from '@/app/lib/supabase/server'
import {revalidatePath} from 'next/cache'

const importLichessGames = async (
  collectionId: string,
  lastRefreshed: Date | null,
  username: string,
) => {
  console.time('insertLichessGames')
  const supabase = createServerClient()

  const url = `https://lichess.org/api/games/user/${username}?${new URLSearchParams({
    since: `${lastRefreshed?.getTime() ?? ''}`,
    moves: 'false',
    opening: 'true',
    lastFen: 'true',
  })}`

  const qr = await fetch(url, {headers: {accept: 'application/x-ndjson'}})
  const text = await qr.text()
  console.timeLog('insertLichessGames', `fetched ${text.length} bytes`)

  const data: Game[] = text
    .split(/\r?\n/)
    .map((l) => (l.trim() ? JSON.parse(l) : null))
    .filter((l) => l)

  try {
    const {error} = await supabase.from('games').insert(
      data.map<Database['public']['Tables']['games']['Insert']>((g) => ({
        site: 'lichess',
        collection_id: collectionId,
        eco: g.opening.name,
        fen: g.lastFen,
        game_dttm: new Date(g.createdAt).toISOString(),
        clock_initial: g.clock.initial,
        clock_increment: g.clock.increment,
        lichess_game_id: g.id,
        white_username: g.players.white.user.name,
        black_username: g.players.black.user.name,
        white_rating: g.players.white.rating,
        black_rating: g.players.black.rating,
        winner: g.winner,
      })),
    )

    console.timeLog('insertLichessGames', 'inserted')

    if (error) {
      console.log('Error inserting games for Lichess')
      console.error(error)
    } else {
      await supabase
        .from('collections')
        .update({last_refreshed: new Date().toISOString()})
        .eq('id', collectionId)
    }
  } catch (e) {
    console.log('Caught error inserting games for Lichess')
    console.error(e)
  }

  console.timeEnd('insertLichessGames')
  revalidatePath(`/collections/${collectionId}`)
}

interface User {
  name: string
  flair?: string
  patron?: boolean
  id: string
}

interface Player {
  user: User
  rating: number
}

interface Players {
  white: Player
  black: Player
}

interface Opening {
  eco: string
  name: string
  ply: number
}

interface Clock {
  initial: number
  increment: number
  totalTime: number
}

interface Game {
  id: string
  rated: boolean
  variant: string
  speed: string
  perf: string
  createdAt: number
  lastMoveAt: number
  status: string
  source: string
  players: Players
  winner: string
  opening: Opening
  clock: Clock
  lastFen: string
  lastMove: string
}

export default importLichessGames
