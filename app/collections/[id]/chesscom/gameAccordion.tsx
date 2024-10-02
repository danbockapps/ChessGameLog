'use client'

import {createBrowserClient} from '@/app/lib/supabase/client'
import Accordion from '@/app/ui/accordion'
import {FC, useState} from 'react'
import {ChesscomResult} from '../actions/importChesscomGames'
import GameAccordionHeader from '../gameAccordionHeader'
import Notes from '../notes'
import Board from './board'

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
  notes: string | null
}

const ChesscomGameAccordion: FC<Props> = (props) => {
  const [notes, setNotes] = useState(props.notes ?? '')

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

  const supabase = createBrowserClient()

  const save = async () => {
    const {error} = await supabase.from('games').update({notes}).eq('id', props.id)
    console.log({error})
  }

  return (
    <Accordion
      cardClassName="mb-4"
      {...{header}}
      headerClassName="px-4 py-4 flex items-center gap-4 whitespace-nowrap"
      contentClassName="p-4"
    >
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <Board
          whiteUsername={props.whiteUsername}
          username={props.username}
          url={props.url}
          fen={props.fen}
        />

        <div className="bg-gray-500">Game ID: {props.id}</div>

        <Notes gameId={props.id} {...{notes, setNotes, save}} />
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
