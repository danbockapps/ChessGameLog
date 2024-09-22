import {createBrowserClient} from '@/app/lib/supabase/client'
import {FC, useEffect, useState} from 'react'
import Modal from '../modal'
import StepName from './stepName'
import StepType from './stepType'
import StepUsername from './stepUsername'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export type Step = 'type' | 'username' | 'name'
export type Type = 'manual' | 'chess.com' | 'lichess' | null

const CreateNewModal: FC<Props> = (props) => {
  const [step, setStep] = useState<Step>('type')
  const [type, setType] = useState<Type>(null)
  const [username, setUsername] = useState<string>('')
  const [name, setName] = useState<string>('')
  const supabase = createBrowserClient()

  // Reset the step when the modal is closed
  useEffect(() => {
    if (!props.isOpen) {
      setStep('type')
      setType(null)
      setUsername('')
      setName('')
    }
  }, [props.isOpen])

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Create new collection</h2>
        {step === 'type' && <StepType {...{setType, setStep}} />}

        {step === 'username' && (
          <StepUsername {...{setStep, type, setType, username, setUsername}} />
        )}

        {step === 'name' && (
          <StepName
            {...{setStep, type, setType, username, setUsername, name, setName}}
            create={async () => {
              // TODO error handling
              await supabase.from('collections').insert({
                name: name.trim() ?? 'Untitled Collection',
                site: (type && type === 'lichess') || type === 'chess.com' ? type : null,
              })
              props.setIsOpen(false)
            }}
          />
        )}
      </div>
    </Modal>
  )
}

export default CreateNewModal
