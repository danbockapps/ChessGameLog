import {FC} from 'react'
import Back from '../back'
import {Step, Type} from './createNewModal'

interface Props {
  setStep: (step: Step) => void
  type: Type
  setType: (type: Type) => void
  username: string
  setUsername: (username: string) => void
}

const StepUsername: FC<Props> = (props) => (
  <>
    <Back
      onClick={() => {
        props.setType(null)
        props.setStep('type')
      }}
    />
    <input
      type="text"
      placeholder="Username"
      className="w-full p-2 border border-gray-300 rounded"
      value={props.username}
      onChange={(e) => props.setUsername(e.target.value)}
    />
    Enter your username on {props.type === 'chesscom' ? 'Chess.com' : 'Lichess'}.
    <button
      onClick={() => props.setStep('name')}
      className="w-full bg-blue-500 text-white p-2 rounded"
    >
      Next
    </button>
  </>
)

export default StepUsername
