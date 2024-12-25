import {createBrowserClient} from '@/app/lib/supabase/client'
import {Close} from '@mui/icons-material'
import {Dialog, IconButton, Link} from '@mui/material'
import {FC, useCallback, useEffect, useState} from 'react'
import {useAppContext} from '../../context'
import SectionHeader from '@/app/ui/SectionHeader'
import DescriptionDialog from './descriptionDialog'
import {saveTagDescription} from './actions'

interface Props {
  open: boolean
  close: () => void
}

type Tag = {
  id: number
  name: string | null
  description: string | null
  public: boolean | null
}

const ManageTags: FC<Props> = (props) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [descToEdit, setDescToEdit] = useState<number | null>(null)
  const {user} = useAppContext()

  const supabase = createBrowserClient()

  const refresh = useCallback(async () => {
    const {data, error} = await supabase
      .from('tags')
      .select('id, name, description, public')
      .or(`owner_id.eq.${user.id}, public.eq.1`)

    if (error) {
      console.error('Error fetching tags:', error)
    } else {
      setTags(data)
    }
  }, [supabase, user.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <Dialog
      open={props.open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {height: {xs: '98%', md: 'auto'}, padding: {xs: 1, md: 2}},
      }}
    >
      <SectionHeader title="Manage Tags" description="Add, edit, and delete tags" />

      <div className="mt-4 overflow-auto flex flex-col items-start">
        {tags.map((t) => (
          <div key={t.id} className="mb-8">
            <div className="bg-slate-200 px-2 py-1 rounded text-sm">{t.name}</div>
            <div>
              {t.description ?? (
                <Link onClick={() => setDescToEdit(t.id)} sx={{fontSize: '0.8em'}}>
                  Add description
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <IconButton onClick={props.close} sx={{position: 'absolute', top: 1, right: 1}}>
        <Close />
      </IconButton>

      {descToEdit && (
        <DescriptionDialog
          open={descToEdit !== null}
          onClose={() => setDescToEdit(null)}
          existingDescription={tags.find((t) => t.id === descToEdit)?.description ?? null}
          onApply={async (description) => {
            await saveTagDescription(descToEdit, description)
            await refresh()
            setDescToEdit(null)
          }}
        />
      )}
    </Dialog>
  )
}

export default ManageTags
