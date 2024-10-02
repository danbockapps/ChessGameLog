import Button from '@/app/ui/button'
import {FC} from 'react'

interface Props {
  gameId: number
  notes: string | null
  setNotes: (notes: string) => void
  save: () => void
}

const Notes: FC<Props> = (props) => {
  return (
    <div className="flex flex-col">
      <textarea
        className="w-full h-full p-2 mb-2 border"
        value={props.notes ?? ''}
        onChange={(e) => props.setNotes(e.target.value)}
      />

      <Button className="self-end" onClick={props.save}>
        Save
      </Button>
    </div>
  )
}

export default Notes
