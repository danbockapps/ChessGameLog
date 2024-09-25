import {FC} from 'react'
import Back from '../back'
import {Step, Type} from './createNewModal'

interface Props {
  setType: (type: Type) => void
  setStep: (step: Step) => void
  type: Type
  name: string
  setName: (name: string) => void
  create: () => void
}

const StepName: FC<Props> = (props) => (
  <>
    <Back
      onClick={() => {
        if (props.type === 'manual') {
          props.setType(null)
          props.setStep('type')
        } else {
          props.setStep('username')
        }
      }}
    />
    <input
      type="text"
      placeholder="Collection name"
      className="w-full p-2 border border-gray-300 rounded"
      value={props.name}
      onChange={(e) => props.setName(e.target.value)}
    />
    Optional: Enter a name for your collection.
    <button onClick={props.create} className="w-full bg-blue-500 text-white p-2 rounded">
      Create collection
    </button>
  </>
)

export default StepName