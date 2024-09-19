'use client'

import {FC, useState} from 'react'
import Card from '../card'
import CreateNewModal from './createNewModal'

const CreateNew: FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className="w-96 h-48 flex items-center justify-center cursor-pointer"
      >
        <div className="text-center">
          <div className="text-4xl">+</div>
          <div>Create new collection</div>
        </div>
      </Card>

      <CreateNewModal {...{isOpen, setIsOpen}} />
    </>
  )
}

export default CreateNew
