import {createServerClient} from '@/app/lib/supabase/server'
import Accordion from '@/app/ui/accordion'
import Link from 'next/link'
import RefreshButton from './RefreshButton'

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

  return (
    <div className="p-4">
      <Link href="/collections">⬅️ Collections</Link>
      <h1>{name ?? ''}</h1>
      Last refreshed: {lastRefreshed?.toLocaleString() ?? 'Never'}
      {site && username && <RefreshButton collectionId={id} {...{site, username, lastRefreshed}} />}
      <div>
        {games.map(
          (g, i) =>
            g.gameDttm && (
              <Accordion key={i} header={g.opponent}>
                {g.gameDttm.toLocaleString()} {g.opponent}
              </Accordion>
            ),
        )}
      </div>
    </div>
  )
}
