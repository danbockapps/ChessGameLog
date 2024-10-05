import {createServerClient} from '@/app/lib/supabase/server'
import Accordion from '@/app/ui/accordion'
import Link from 'next/link'
import {ChesscomResult} from './actions/importChesscomGames'
import ChesscomGameAccordion from './chesscom/gameAccordion'
import RefreshButton from './refreshButton'
import {Tag} from './tags'

export default async function Collection({params: {id}}: {params: {id: string}}) {
  const supabase = createServerClient()
  const user = await supabase.auth.getUser()

  const [collectionsResult, gamesResult, tagsResult] = await Promise.all([
    supabase.from('collections').select('name,username,site,last_refreshed').eq('id', id).single(),
    supabase.from('games').select().eq('collection_id', id),
    supabase
      .from('tags')
      .select('id, name, games ( id )')
      .or(`owner_id.eq.${user.data.user?.id}, public.eq.1`),
  ])

  const {name, username, site, last_refreshed} = collectionsResult.data ?? {}
  const lastRefreshed = last_refreshed ? new Date(last_refreshed) : null
  const options: Tag[] = tagsResult.data?.map((t) => ({id: t.id, name: t.name})) ?? []

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
        notes: g.notes,
      }))
      .sort((a, b) => (a.gameDttm && b.gameDttm ? (b.gameDttm > a.gameDttm ? 1 : -1) : 0))
      .filter((_g, i) => i < 5) ?? [] // TODO paging

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
                notes={g.notes}
                {...{options}}
                tags={
                  tagsResult.data
                    ?.filter((t) => t.games.some((ga) => ga.id === g.id))
                    .map((t) => t.id) ?? []
                }
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
