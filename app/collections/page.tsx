import {redirect} from 'next/navigation'
import {createServerClient} from '../lib/supabase/server'
import Card from '../ui/card'
import CollectionCard from '../ui/collectionCard'
import SignOutButton from '../ui/signOutButton'

export default async function PrivatePage() {
  const supabase = createServerClient()

  const {data, error} = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  const {data: collections} = await supabase.from('collections').select()

  return (
    <div>
      <p>Collections for {data.user.email}</p>
      <div className="flex flex-wrap gap-4 p-4 bg-gradient-to-r from-gray-100 to-gray-200">
        {collections?.map((c) => (
          <CollectionCard key={c.id} title={c.name ?? ''}>
            {c.name}
          </CollectionCard>
        ))}

        <Card className="w-96 h-48 flex items-center justify-center cursor-pointer">
          <div className="text-center">
            <div className="text-4xl">+</div>
            <div>Create new collection</div>
          </div>
        </Card>
      </div>
      <SignOutButton />
    </div>
  )
}
