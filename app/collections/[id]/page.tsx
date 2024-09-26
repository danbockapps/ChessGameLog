import {createServerClient} from '@/app/lib/supabase/server'
import Link from 'next/link'
import Button from '@/app/ui/button'
import importChesscomGames from './actions/importChesscomGames'
import importLichessGames from './actions/importLichessGames'

export default async function Collection({params: {id}}: {params: {id: string}}) {
  const supabase = createServerClient()
  // TODO auth check

  const [collectionsResult, gamesResult] = await Promise.all([
    supabase.from('collections').select('name,username,site,last_refreshed').eq('id', id),
    supabase.from('games').select().eq('collection_id', id),
  ])

  const {name, username, site, last_refreshed} = collectionsResult.data?.[0] ?? {}
  const lastRefreshed = last_refreshed ? new Date(last_refreshed) : null

  const games =
    gamesResult.data
      ?.map((g) => ({
        url: g.url,
        gameDttm: g.game_dttm && new Date(g.game_dttm),
        opponent:
          g.white_username?.toLowerCase() === username?.toLowerCase()
            ? g.black_username
            : g.white_username,
        eco: g.eco,
        timeControl: g.time_control,
      }))
      .sort((a, b) => (a.gameDttm && b.gameDttm ? (b.gameDttm > a.gameDttm ? 1 : -1) : 0)) ?? []

  const refresh = async () => {
    'use server'
    if (site === 'chess.com' && username) await importChesscomGames(id, lastRefreshed, username)
    if (site === 'lichess' && username) await importLichessGames(id, lastRefreshed, username)
  }

  return (
    <div className="p-4">
      <Link href="/collections">⬅️ Collections</Link>
      <h1>{name ?? ''}</h1>
      Last refreshed: {lastRefreshed?.toLocaleString() ?? 'Never'}
      {site && (
        <form>
          <Button formAction={refresh}>Refresh</Button>
        </form>
      )}
      <div>
        {games.map(
          (g, i) =>
            g.gameDttm && (
              <div key={i}>
                {g.gameDttm.toLocaleString()} {g.opponent}
              </div>
            ),
        )}
      </div>
    </div>
  )
}
