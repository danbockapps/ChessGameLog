import {createServerClient} from '../lib/supabase/server'
import CreateNew from '../ui/createNew/createNew'
import CollectionCard from './collectionCard'

export default async function PrivatePage() {
  const supabase = createServerClient()

  const {
    data: {user},
  } = await supabase.auth.getUser()

  if (!user) return <>Please log in to continue.</>

  const {data: collections} = await supabase
    .from('collections')
    .select()
    .filter('owner_id', 'eq', user?.id)

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {collections?.map((c) => (
        <CollectionCard key={c.id} id={c.id} title={c.name ?? ''}>
          {c.name}
        </CollectionCard>
      ))}

      <CreateNew />
    </div>
  )
}
