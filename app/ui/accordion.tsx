'use client'
import './accordion.css'

import {FC, PropsWithChildren, ReactNode, useState} from 'react'
import Card from './card'

interface Props {
  header: ReactNode
}

const Accordion: FC<PropsWithChildren<Props>> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card onClick={() => setIsOpen(!isOpen)} className="m-2 p-4">
      <div>{props.header}</div>

      <div className={`accordion-wrapper ${isOpen ? 'is-open' : ''}`}>
        <div className="accordion-inner">{props.children}</div>
      </div>
    </Card>
  )
}

export default Accordion
