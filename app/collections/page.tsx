import {redirect} from 'next/navigation'
import {createServerClient} from '../lib/supabase/server'
import CollectionCard from './collectionCard'
import CreateNew from './createNew'

export default async function PrivatePage() {
  const supabase = createServerClient()

  const {data, error} = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  const {data: collections} = await supabase.from('collections').select()

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
