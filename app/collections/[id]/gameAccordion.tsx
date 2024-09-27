import Accordion from '@/app/ui/accordion'
import {FC} from 'react'
import {Result} from './actions/importChesscomGames'

interface Props {
  id: number
  username: string // Our user's username
  whiteUsername: string
  blackUsername: string
  whiteResult: Result
  blackResult: Result
  gameDttm: Date
  eco: string
  timeControl: string
  url: string
}

// chesscom only

const GameAccordion: FC<Props> = (props) => {
  const ourResult =
    props.whiteUsername.toLowerCase() === props.username.toLowerCase()
      ? props.whiteResult
      : props.blackResult

  const header = (
    <>
      <div className={`h-2 w-2 rounded ${getDotColor(ourResult)}`} />
      {props.whiteUsername} vs. {props.blackUsername}
    </>
  )

  return (
    <Accordion
      cardClassName="mb-4"
      {...{header}}
      headerClassName={`px-4 py-4 flex items-center gap-4`}
    >
      board goes here
    </Accordion>
  )
}

const getDotColor = (result: Result) => {
  const points = getPoints(result)

  switch (points) {
    case 1:
      return 'bg-green-500'
    case 0.5:
      return 'bg-gray-500'
    case 0:
      return 'bg-red-500'
  }
}

const getPoints = (result: Result): 0 | 0.5 | 1 => {
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

export default GameAccordion
