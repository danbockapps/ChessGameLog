'use server'

const getSingleChesscomGame = async (url: string) => {
  const response = await fetch(`https://www.chess.com/callback/live/game/${url.split('/').pop()}`)
  const result = await response.json()
  return decodeTcn(result.game.moveList)
}

const T = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^)[_]@#$,./&-*++='

const decodeTcn = (n: string) => {
  var i,
    o,
    s,
    _,
    w = n.length,
    C = []
  for (i = 0; i < w; i += 2)
    (_ = {}),
      (o = T.indexOf(n[i])),
      (s = T.indexOf(n[i + 1])) > 63 &&
        ((_.promotion = 'qnrbkp'[Math.floor((s - 64) / 3)]),
        (s = o + (o < 16 ? -8 : 8) + ((s - 1) % 3) - 1)),
      o > 75 ? (_.drop = 'qnrbkp'[o - 79]) : (_.from = T[o % 8] + (Math.floor(o / 8) + 1)),
      (_.to = T[s % 8] + (Math.floor(s / 8) + 1)),
      C.push(_)
  return C
}

export default getSingleChesscomGame
