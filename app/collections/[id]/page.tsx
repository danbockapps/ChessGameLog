import {createServerClient} from '@/app/lib/supabase/server'
import {captionClassNames} from '@/app/ui/SectionHeader'
import Link from 'next/link'
import {FC} from 'react'
import {ChesscomResult} from './actions/importChesscomGames'
import ChesscomGameAccordion from './chesscom/gameAccordion'
import LichessGameAccordion from './lichess/gameAccordion'
import RefreshButton from './refreshButton'
import {Tag} from './tags'

interface Props {
  params: {id: string}
  searchParams: {page: string}
}

const PAGE_SIZE = 50

const Collection: FC<Props> = async (props) => {
  const supabase = createServerClient()
  const page = parseInt(props.searchParams.page) || 1

  const [collectionsResult, gamesResult] = await Promise.all([
    supabase
      .from('collections')
      .select('name,username,site,last_refreshed')
      .eq('id', props.params.id)
      .single(),

    supabase
      .from('games')
      .select()
      .eq('collection_id', props.params.id)
      .order('game_dttm', {ascending: false})
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
  ])

  const {name, username, site, last_refreshed} = collectionsResult.data ?? {}
  const lastRefreshed = last_refreshed ? new Date(last_refreshed) : null

  const games =
    gamesResult.data?.map((g) => ({
      id: g.id,
      url: g.url,
      lichessGameId: g.lichess_game_id,
      gameDttm: g.game_dttm && new Date(g.game_dttm),
      whiteUsername: g.white_username,
      blackUsername: g.black_username,
      whiteResult: g.white_result as ChesscomResult,
      blackResult: g.black_result as ChesscomResult,
      winner: g.winner,
      eco: g.eco,
      timeControl: g.time_control,
      clockInitial: g.clock_initial,
      clockIncrement: g.clock_increment,
      fen: g.fen,
      notes: g.notes,
    })) ?? []

  return (
    <div className="p-4">
      <Link href="/collections">⬅ Collections</Link>
      <div className="py-6 flex justify-between items-center">
        <h1 className="text-xl">{name ?? ''}</h1>

        {site && username && page === 1 && (
          <>
            <p className={`${captionClassNames} ml-auto mr-4`}>
              Last refreshed: {lastRefreshed?.toLocaleString() ?? 'Never'}
            </p>
            <RefreshButton collectionId={props.params.id} {...{site, username, lastRefreshed}} />
          </>
        )}

        {page > 1 && (
          <Link className="underline" href={`/collections/${props.params.id}`}>
            Back to first page
          </Link>
        )}
      </div>
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
              />
            ) : (
              <LichessGameAccordion
                key={g.lichessGameId}
                id={g.id}
                username={username!}
                whiteUsername={g.whiteUsername!} // TODO
                blackUsername={g.blackUsername!}
                winner={g.winner as 'white' | 'black' | 'draw'}
                gameDttm={g.gameDttm}
                eco={g.eco!}
                clockInitial={g.clockInitial!}
                clockIncrement={g.clockIncrement!}
                lichessGameId={g.lichessGameId!}
                fen={g.fen!}
                notes={g.notes}
              />
            )),
        )}
      </div>

      <div className="py-6 flex gap-4 justify-center underline">
        {[...Array(page - 1)].map((_, i) => (
          <Link key={i} href={`/collections/${props.params.id}?page=${i + 1}`}>
            {i + 1}
          </Link>
        ))}

        <Link href={`/collections/${props.params.id}?page=${page + 1}`}>Next page</Link>
      </div>
    </div>
  )
}

export default Collection
