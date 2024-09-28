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
      <div className="text-gray-500">{getReadableTimeControl(props.timeControl)}</div>
      <div className="hidden md:block ml-auto truncate max-w-sm text-gray-500">
        {getReadableEco(props.eco)}
      </div>
      <div className="ml-auto md:ml-0 text-gray-500">{getRelativeTime(props.gameDttm)}</div>
    </>
  )

  return (
    <Accordion
      cardClassName="mb-4"
      {...{header}}
      headerClassName="px-4 py-4 flex items-center gap-4 whitespace-nowrap"
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

const getRelativeTime = (date: Date) => {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
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

export default GameAccordion
