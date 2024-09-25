import {createServerClient} from '@/app/lib/supabase/server'
import Link from 'next/link'
import {insertChesscomGames} from './actions'
import Button from '@/app/ui/button'

export default async function Collection({params: {id}}: {params: {id: string}}) {
  const supabase = createServerClient()
  // TODO auth check

  const [collectionsResult, gamesResult] = await Promise.all([
    supabase.from('collections').select('name,site,last_refreshed').eq('id', id),
    supabase.from('games').select().eq('collection_id', id),
  ])

  const {name, site, last_refreshed} = collectionsResult.data?.[0] ?? {}
  const lastRefreshed = last_refreshed ? new Date(last_refreshed).toLocaleString() : null

  const games =
    gamesResult.data
      ?.map((g) => ({
        url: g.url,
        gameDttm: g.game_dttm && new Date(g.game_dttm),
        opponent: g.opponent,
        eco: g.eco,
        timeControl: g.time_control,
      }))
      .sort((a, b) => (a.gameDttm && b.gameDttm ? (b.gameDttm > a.gameDttm ? 1 : -1) : 0)) ?? []

  const refresh = async () => {
    'use server'
    if (site === 'chess.com') await insertChesscomGames(id)
  }

  return (
    <div className="p-4">
      <Link href="/collections">⬅️ Collections</Link>
      <h1>{name ?? ''}</h1>
      Last refreshed: {lastRefreshed ?? 'Never'}
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
