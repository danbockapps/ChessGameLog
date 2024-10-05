import {createBrowserClient} from '@/app/lib/supabase/client'
import Button from '@/app/ui/button'
import {FC, useState} from 'react'

interface Props {
  gameId: number
  savedNotes: string | null
}

const Notes: FC<Props> = (props) => {
  const [notes, setNotes] = useState(props.savedNotes ?? '')
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  return (
    <div className="flex flex-col">
      <textarea
        className="w-full h-full p-2 mb-2 border"
        value={notes ?? ''}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
      />

      <Button
        className="self-end w-32"
        {...{loading}}
        onClick={async () => {
          setLoading(true)
          await supabase.from('games').update({notes}).eq('id', props.gameId)
          setLoading(false)
        }}
      >
        Save notes
      </Button>
    </div>
  )
}

export default Notes
