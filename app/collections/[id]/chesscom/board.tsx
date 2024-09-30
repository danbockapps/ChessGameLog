import {Chess} from 'chess.js'
import {FC, useRef, useState} from 'react'
import getSingleChesscomGame, {ChessJsMoveParam} from '../actions/getSingleChesscomGame'
import {Chessboard} from 'react-chessboard'

interface Props {
  whiteUsername: string
  username: string
  url: string
  fen: string
}

const Board: FC<Props> = (props) => {
  const chess = useRef<Chess>(new Chess())
  const [moves, setMoves] = useState<ChessJsMoveParam[]>()
  const [currentMove, setCurrentMove] = useState<number>()
  const [disabled, setDisabled] = useState(false)

  const loadGame = async () => {
    setDisabled(true)
    const res = await getSingleChesscomGame(props.url)
    setMoves(res)
    setDisabled(false)
    return res
  }

  const backwardButtonsDisabled = disabled || currentMove === 0

  const forwardButtonsDisabled =
    disabled || !moves || currentMove === undefined || currentMove >= moves.length

  return (
    <div>
      <Chessboard
        arePiecesDraggable={false}
        boardOrientation={
          props.whiteUsername.toLowerCase() === props.username.toLowerCase() ? 'white' : 'black'
        }
        position={moves ? chess.current.fen() : props.fen}
        customDarkSquareStyle={{backgroundColor: '#779955'}}
        customLightSquareStyle={{backgroundColor: '#e9eecd'}}
      />

      <div className="py-2 flex">
        <button
          className={`flex-1 ${backwardButtonsDisabled ? 'text-slate-300' : 'text-black'}`}
          disabled={backwardButtonsDisabled}
          onClick={async () => {
            if (!moves) await loadGame()
            setCurrentMove(0)
            chess.current.reset()
          }}
        >
          | &lt;
        </button>

        <button
          className={`flex-1 ${backwardButtonsDisabled ? 'text-slate-300' : 'text-black'}`}
          disabled={backwardButtonsDisabled}
          onClick={async () => {
            if (moves && currentMove !== undefined && currentMove > 0) {
              chess.current.undo()
              setCurrentMove(currentMove - 1)
            } else {
              const correctMoves = await loadGame()
              const newCurrentMove = correctMoves.length - 1

              correctMoves.forEach((move, i) => {
                if (i < newCurrentMove) {
                  chess.current.move(move)
                }
              })

              setCurrentMove(newCurrentMove)
            }
          }}
        >
          &lt;
        </button>

        <button
          className={`flex-1 ${forwardButtonsDisabled ? 'text-slate-300' : 'text-black'}`}
          disabled={forwardButtonsDisabled}
          onClick={() => {
            if (moves && currentMove !== undefined && currentMove < moves.length) {
              chess.current.move(moves[currentMove])
              setCurrentMove(currentMove + 1)
            }
          }}
        >
          &gt;
        </button>

        <button
          className={`flex-1 ${forwardButtonsDisabled ? 'text-slate-300' : 'text-black'}`}
          disabled={forwardButtonsDisabled}
          onClick={() => {
            if (moves && currentMove !== undefined) {
              moves.forEach((move, i) => {
                if (i >= currentMove) chess.current.move(move)
              })

              setCurrentMove(moves.length)
            }
          }}
        >
          &gt; |
        </button>
      </div>
    </div>
  )
}

export default Board
