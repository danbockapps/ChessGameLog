'use client'

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

      {isOpen && <div>{props.children}</div>}
    </Card>
  )
}

export default Accordion
