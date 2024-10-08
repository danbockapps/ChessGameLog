import {createBrowserClient} from '@/app/lib/supabase/client'
import SectionHeader, {captionClassNames} from '@/app/ui/SectionHeader'
import {FC, useState} from 'react'
import {MultiValue} from 'react-select'
import CreatableSelect from 'react-select/creatable'

interface Props {
  options: Tag[]
  tags: number[]
  gameId: number
}

export type Tag = {id: number; name: string | null}

const Tags: FC<Props> = (props) => {
  const [values, setValues] = useState<MultiValue<Tag> | null>()
  const [loading, setLoading] = useState(false)
  const [beenSaved, setBeenSaved] = useState(false)
  const supabase = createBrowserClient()

  const selectedOptions =
    values ??
    (props.tags.map((tagId) => props.options.find((tag) => tag.id === tagId)) as MultiValue<Tag>)

  const insertGameTag = async (tagId: number, gameId: number) => {
    await supabase.from('game_tag').insert({tag_id: tagId, game_id: gameId})
  }

  return (
    <div>
      <SectionHeader title="Takeaways" description="Select tags or create your own" />
      <CreatableSelect
        isMulti
        isDisabled={loading}
        isLoading={loading}
        isClearable={false}
        value={selectedOptions}
        onChange={async (newValue) => {
          setLoading(true)
          const oldIds = selectedOptions.map((v) => v.id) ?? []
          const newIds = newValue.map((v) => v.id)

          if (oldIds.length > newIds.length) {
            await supabase
              .from('game_tag')
              .delete()
              .eq('game_id', props.gameId)
              .eq(
                'tag_id',
                oldIds.filter((id) => !newIds.includes(id)),
              )
          } else if (oldIds.length < newIds.length) {
            await insertGameTag(newIds.filter((id) => !oldIds.includes(id))[0], props.gameId)
          }

          setValues(newValue)
          setBeenSaved(true)
          setLoading(false)
        }}
        onCreateOption={async (inputValue) => {
          setLoading(true)
          const {data} = await supabase.from('tags').insert({name: inputValue}).select('id')
          if (data && data.length !== 0) await insertGameTag(data[0]?.id, props.gameId)
          setBeenSaved(true)
          setLoading(false)
        }}
        options={props.options}
        getOptionValue={({id}) => `${id}`}
        getOptionLabel={({name}) => name ?? ''}
      />

      <div className={`${captionClassNames} mt-5`}>
        {loading ? 'Saving...' : beenSaved ? '✓ Takeaways saved' : ''}
      </div>
    </div>
  )
}

export default Tags
