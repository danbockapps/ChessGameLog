import {redirect} from 'next/navigation'
import {createServerClient} from '../lib/supabase/server'
import SignOutButton from '../ui/signOutButton'

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
      <SignOutButton />
    </div>
  )
}
