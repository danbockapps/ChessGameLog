import {redirect} from 'next/navigation'
import {createServerClient} from '../lib/supabase/server'
import SignOutButton from '../ui/signOutButton'
import Card from '../ui/card'

export default async function PrivatePage() {
  const supabase = createServerClient()

  const {data, error} = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  const {data: users, error: usersError} = await supabase.from('profiles').select()

  console.log({users, usersError})

  return (
    <div>
      <p>Collections for {data.user.email}</p>
      <div className="flex flex-wrap gap-4 p-4">
        <Card className="w-96 h-48">hello</Card>
        <Card className="w-96 h-48">hello</Card>
        <Card className="w-96 h-48">hello</Card>
      </div>
      <SignOutButton />
    </div>
  )
}
