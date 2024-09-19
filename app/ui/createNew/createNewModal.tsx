import {FC, useEffect, useState} from 'react'
import Modal from '../modal'
import Image from 'next/image'
import lichessLogo from './lichess.svg'
import Back from '../back'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

type Step = 'type' | 'username' | 'name'
type Type = 'manual' | 'chesscom' | 'lichess'

const CreateNewModal: FC<Props> = (props) => {
  const [step, setStep] = useState<Step>('type')
  const [type, setType] = useState<Type>()
  const [username, setUsername] = useState<string>()

  // Reset the step when the modal is closed
  useEffect(() => {
    if (!props.isOpen) {
      setStep('type')
      setType(undefined)
    }
  }, [props.isOpen])

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Create new collection</h2>
        {step === 'type' && (
          <>
            <button
              onClick={() => {
                setType('manual')
                setStep('name')
              }}
              className="w-full flex items-center justify-center h-14 bg-gray-200 text-gray-700 p-2 rounded"
            >
              <span className="flex-grow">Manual Collection</span>
            </button>
            Use this for OTB games.
            <button
              onClick={() => {
                setType('chesscom')
                setStep('username')
              }}
              className="w-full flex items-center justify-center bg-[#2d2c28] text-gray-700 p-2 rounded"
            >
              <img
                src="https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/PedroPinhata/phpNgJfyb.png"
                alt="Chess.com"
                className="h-10 w-32 mr-2"
              />
            </button>
            Your games will be imported from Chess.com.
            <button
              onClick={() => {
                setType('lichess')
                setStep('username')
              }}
              className="w-full flex items-center justify-center gap-2 bg-black text-white p-2 rounded"
            >
              <Image
                src={lichessLogo}
                width={24}
                height={24}
                alt="Lichess"
                className="h-10 w-10 mr-2"
              />
              <span>Lichess</span>
            </button>
            Your games will be imported from Lichess.
          </>
        )}

        {step === 'username' && (
          <>
            <Back
              onClick={() => {
                setType(undefined)
                setStep('type')
              }}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            Enter your username on {type === 'chesscom' ? 'Chess.com' : 'Lichess'}.
            <button
              onClick={() => setStep('name')}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Next
            </button>
          </>
        )}

        {step === 'name' && (
          <>
            <Back
              onClick={() => {
                if (type === 'manual') {
                  setType(undefined)
                  setStep('type')
                } else {
                  setStep('username')
                }
              }}
            />
            <input
              type="text"
              placeholder="Collection name"
              className="w-full p-2 border border-gray-300 rounded"
            />
            Optional: Enter a name for your collection.
            <button className="w-full bg-blue-500 text-white p-2 rounded">Create collection</button>
          </>
        )}
      </div>
    </Modal>
  )
}

export default CreateNewModal
