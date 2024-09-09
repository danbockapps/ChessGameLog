'use client'

import {FC, useState} from 'react'
import Card from '../ui/card'
import Modal from '../ui/modal'

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

      <Modal {...{isOpen}} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Create new collection</h2>
          <input
            type="text"
            placeholder="Collection name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">Create collection</button>
        </div>
      </Modal>
    </>
  )
}

export default CreateNew
