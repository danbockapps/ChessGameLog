'use client'

import Accordion from '@/app/ui/accordion'
import {FC} from 'react'
import {ChesscomResult} from './actions/importChesscomGames'
import GameAccordionHeader from './gameAccordionHeader'
import getSingleChesscomGame from './actions/getSingleChesscomGame'

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
}

// chesscom only

const ChesscomGameAccordion: FC<Props> = (props) => {
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

  return (
    <Accordion
      cardClassName="mb-4"
      {...{header}}
      headerClassName="px-4 py-4 flex items-center gap-4 whitespace-nowrap"
      onExpand={async () => {
        const res = await getSingleChesscomGame(props.url)
        console.log(res)
      }}
    >
      board goes here
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
