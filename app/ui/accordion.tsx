'use client'
import './accordion.css'

import {FC, PropsWithChildren, ReactNode, useState} from 'react'
import Card from './card'

interface Props {
  header: ReactNode
  cardClassName?: string
  headerClassName?: string
  contentClassName?: string
  onExpand?: () => void
}

const Accordion: FC<PropsWithChildren<Props>> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card
      onClick={() => {
        if (props.onExpand && !isOpen) props.onExpand()
        setIsOpen(!isOpen)
      }}
      className={props.cardClassName}
    >
      <div className={`cursor-pointer ${props.headerClassName ?? ''}`}>{props.header}</div>

      <div className={`accordion-wrapper ${isOpen ? 'is-open' : ''}`}>
        <div className={`accordion-inner ${props.contentClassName ?? ''}`}>{props.children}</div>
      </div>
    </Card>
  )
}

export default Accordion
