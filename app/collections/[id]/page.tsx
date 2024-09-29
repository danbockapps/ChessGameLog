import {createServerClient} from '@/app/lib/supabase/server'
import Accordion from '@/app/ui/accordion'
import Link from 'next/link'
import {ChesscomResult} from './actions/importChesscomGames'
import ChesscomGameAccordion from './chesscomGameAccordion'
import RefreshButton from './refreshButton'

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
        id: g.id,
        url: g.url,
        lichessGameId: g.lichess_game_id,
        gameDttm: g.game_dttm && new Date(g.game_dttm),
        whiteUsername: g.white_username,
        blackUsername: g.black_username,
        whiteResult: g.white_result as ChesscomResult,
        blackResult: g.black_result as ChesscomResult,
        eco: g.eco,
        timeControl: g.time_control,
        fen: g.fen,
      }))
      .sort((a, b) => (a.gameDttm && b.gameDttm ? (b.gameDttm > a.gameDttm ? 1 : -1) : 0))
      .filter((_g, i) => i < 5) ?? []

  return (
    <div className="p-4">
      <Link href="/collections">⬅️ Collections</Link>
      <h1>{name ?? ''}</h1>
      Last refreshed: {lastRefreshed?.toLocaleString() ?? 'Never'}
      {site && username && <RefreshButton collectionId={id} {...{site, username, lastRefreshed}} />}
      <div>
        {games.map(
          (g) =>
            g.gameDttm &&
            (site === 'chess.com' ? (
              <ChesscomGameAccordion
                key={g.url ?? g.lichessGameId}
                id={g.id}
                username={username!}
                whiteUsername={g.whiteUsername!} // TODO
                blackUsername={g.blackUsername!}
                whiteResult={g.whiteResult}
                blackResult={g.blackResult}
                gameDttm={g.gameDttm}
                eco={g.eco!}
                timeControl={g.timeControl!}
                url={g.url!}
                fen={g.fen!}
              />
            ) : (
              <Accordion
                key={g.url ?? g.lichessGameId}
                header={`${g.whiteUsername} vs. ${g.blackUsername}`}
              >
                {g.gameDttm.toLocaleString()}
              </Accordion>
            )),
        )}
      </div>
    </div>
  )
}
