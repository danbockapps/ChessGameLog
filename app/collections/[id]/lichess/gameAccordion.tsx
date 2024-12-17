'use client'

import Accordion from '@/app/ui/accordion'
import {gameAccordionClassNames} from '@/app/ui/accordionClassNames'
import {FC} from 'react'
import GameAccordionHeader from '../gameAccordionHeader'
import Notes from '../notes'
import Tags from '../tags'

interface Props {
  id: number
  username: string // Our user's username
  whiteUsername: string
  blackUsername: string
  winner: 'white' | 'black' | 'draw'
  gameDttm: Date
  eco: string
  clockInitial: number
  clockIncrement: number
  lichessGameId: string
  fen: string
}

const {cardClassName, headerClassName, contentClassName} = gameAccordionClassNames

const LichessGameAccordion: FC<Props> = (props) => {
  const ourColor = props.whiteUsername === props.username ? 'white' : 'black'
  const ourResult = props.winner === 'draw' ? 0.5 : props.winner === ourColor ? 1 : 0

  const header = (
    <GameAccordionHeader
      whiteUsername={props.whiteUsername}
      blackUsername={props.blackUsername}
      timeControl={`${props.clockInitial / 60}+${props.clockIncrement}`}
      opening={props.eco}
      gameDttm={props.gameDttm}
      points={ourResult}
    />
  )

  return (
    <Accordion {...{header, cardClassName, headerClassName, contentClassName}}>
      <iframe
        className="lichess-iframe"
        src={`https://lichess.org/embed/game/${props.lichessGameId}/${ourColor}`}
      />

      <Tags gameId={props.id} />
      <Notes gameId={props.id} />
    </Accordion>
  )
}

export default LichessGameAccordion
