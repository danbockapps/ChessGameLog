import {Dialog} from '@mui/material'
import {FC, useState} from 'react'

interface Props {
  open: boolean
  onClose: () => void
  existingDescription: string | null
  onApply: (description: string) => void
}

const DescriptionDialog: FC<Props> = (props) => {
  const [description, setDescription] = useState(props.existingDescription ?? '')

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div className="p-4">
        <textarea
          className="w-60 h-40 border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary" onClick={() => props.onApply(description)}>
            Save
          </button>
        </div>
      </div>
    </Dialog>
  )
}
export default DescriptionDialog
