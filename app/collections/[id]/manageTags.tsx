import {createBrowserClient} from '@/app/lib/supabase/client'
import {Close} from '@mui/icons-material'
import {Dialog, IconButton} from '@mui/material'
import {FC, useEffect, useState} from 'react'
import {useAppContext} from '../context'

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
  const {user} = useAppContext()

  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchTags = async () => {
      const {data, error} = await supabase
        .from('tags')
        .select('id, name, description, public')
        .or(`owner_id.eq.${user.id}, public.eq.1`)

      if (error) {
        console.error('Error fetching tags:', error)
      } else {
        setTags(data)
      }
    }

    fetchTags()
  }, [supabase, user.id])

  return (
    <Dialog open={props.open}>
      {tags.map((t) => (
        <div key={t.id}>
          <div>{t.name}</div>
          <div>{t.description}</div>
        </div>
      ))}

      <IconButton onClick={props.close} sx={{position: 'absolute', top: 1, right: 1}}>
        <Close />
      </IconButton>
    </Dialog>
  )
}

export default ManageTags
