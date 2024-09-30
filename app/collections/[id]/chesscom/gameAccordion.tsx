'use client'

import Accordion from '@/app/ui/accordion'
import {Chess} from 'chess.js'
import {FC, useRef, useState} from 'react'
import {Chessboard} from 'react-chessboard'
import getSingleChesscomGame, {ChessJsMoveParam} from '../actions/getSingleChesscomGame'
import {ChesscomResult} from '../actions/importChesscomGames'
import GameAccordionHeader from '../gameAccordionHeader'

interface Props {
  id: number
  username: string // Our user's username
  whiteUsername: string
  blackUsername: string
  whiteResult: ChesscomResult
  blackResult: ChesscomResult
  gameDttm: Date
  eco: string
  timeControl: string
  url: string
  fen: string
}

// chesscom only

const ChesscomGameAccordion: FC<Props> = (props) => {
  const chess = useRef<Chess>(new Chess())
  const [moves, setMoves] = useState<ChessJsMoveParam[]>()
  const [currentMove, setCurrentMove] = useState<number>()
  const [disabled, setDisabled] = useState(false)

  const ourResult =
    props.whiteUsername.toLowerCase() === props.username.toLowerCase()
      ? props.whiteResult
      : props.blackResult

  const header = (
    <GameAccordionHeader
      whiteUsername={props.whiteUsername}
      blackUsername={props.blackUsername}
      timeControl={getReadableTimeControl(props.timeControl)}
      opening={getReadableEco(props.eco)}
      gameDttm={props.gameDttm}
      points={getPoints(ourResult)}
    />
  )

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
    <Accordion
      cardClassName="mb-4"
      {...{header}}
      headerClassName="px-4 py-4 flex items-center gap-4 whitespace-nowrap"
      contentClassName="p-4"
    >
      <div className="w-[212px]">
        <Chessboard
          arePiecesDraggable={false}
          boardWidth={212} // This crashes with react-chessboard 4.7.1
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
    </Accordion>
  )
}

const getPoints = (result: ChesscomResult): 0 | 0.5 | 1 => {
  switch (result) {
    case 'win':
      return 1

    case 'repetition':
    case 'stalemate':
    case 'insufficient':
    case 'agreed':
    case 'timevsinsufficient':
      return 0.5

    case 'abandoned':
    case 'checkmated':
    case 'timeout':
    case 'resigned':
      return 0
  }
}

const getReadableEco = (eco: string) => {
  if (eco.startsWith('http')) {
    // example: https://www.chess.com/openings/Queens-Pawn-Opening-Stonewall-Attack-3...c5-4.c3-Nc6-5.f4
    return eco.split('openings/').pop()?.split(/\d+/)[0]?.replace(/-/g, ' ') ?? ''
  } else return eco
}

const getReadableTimeControl = (timeControl: string) => {
  const [seconds, increment] = timeControl.split('+').map(Number)
  return `${seconds / 60} ${increment ?? 0}`
}

export default ChesscomGameAccordion
