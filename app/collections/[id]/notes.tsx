import {createBrowserClient} from '@/app/lib/supabase/client'
import Button from '@/app/ui/button'
import SectionHeader, {captionClassNames} from '@/app/ui/SectionHeader'
import {FC, useEffect, useState} from 'react'
import {saveNotes} from './actions/crudActions'

interface Props {
  gameId: number
}

const Notes: FC<Props> = (props) => {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [beenSaved, setBeenSaved] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    setLoading(true)
    supabase
      .from('games')
      .select('notes')
      .eq('id', props.gameId)
      .single()
      .then(({data}) => {
        setNotes(data?.notes ?? '')
        setLoading(false)
      })
  }, [supabase, props.gameId]) // Neither of these 2 ever changes

  return (
    <div className="flex flex-col">
      <SectionHeader
        title="Notes"
        description="Any thoughts you want to remember about this game"
      />
      <textarea
        className="self-stretch flex-1 p-2 mb-2 border"
        value={notes ?? ''}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
      />

      <div className="flex justify-between">
        <div className={`${captionClassNames} mt-5`}>
          {loading ? 'Saving...' : beenSaved ? '✓ Notes saved' : ''}
        </div>

        <Button
          className="self-end w-32"
          {...{loading}}
          onClick={async () => {
            setLoading(true)
            await saveNotes(props.gameId, notes)
            setBeenSaved(true)
            setLoading(false)
          }}
        >
          Save notes
        </Button>
      </div>
    </div>
  )
}

export default Notes
