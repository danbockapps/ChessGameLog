'use server'

import {ChessJsMoveParam} from '../chesscom/board'

export default async function getSingleLichessGame(id: string): Promise<ChessJsMoveParam[]> {
  const url = `https://lichess.org/game/export/${id}?${new URLSearchParams({
    tags: 'false',
    clocks: 'false',
    evals: 'false',
    opening: 'false',
    division: 'false',
  })}`

  const qr = await fetch(url, {
    headers: {accept: 'application/json', Authorization: 'Bearer ' + process.env.LICHESS_TOKEN},
  })

  const obj = await qr.json()
  return obj.moves.split(' ')
}
