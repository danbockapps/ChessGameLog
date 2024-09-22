import Image from 'next/image'
import {FC} from 'react'
import lichessLogo from './lichess.svg'

interface Props {
  setType: (type: 'manual' | 'chesscom' | 'lichess') => void
  setStep: (step: 'type' | 'username' | 'name') => void
}

const StepType: FC<Props> = (props) => (
  <>
    <button
      onClick={() => {
        props.setType('manual')
        props.setStep('name')
      }}
      className="w-full flex items-center justify-center h-14 bg-gray-200 text-gray-700 p-2 rounded"
    >
      <span className="flex-grow">Manual Collection</span>
    </button>
    Use this for OTB games.
    <button
      onClick={() => {
        props.setType('chesscom')
        props.setStep('username')
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
        props.setType('lichess')
        props.setStep('username')
      }}
      className="w-full flex items-center justify-center gap-2 bg-black text-white p-2 rounded"
    >
      <Image src={lichessLogo} width={24} height={24} alt="Lichess" className="h-10 w-10 mr-2" />
      <span>Lichess</span>
    </button>
    Your games will be imported from Lichess.
  </>
)

export default StepType
