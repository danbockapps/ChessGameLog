import {redirect} from 'next/navigation'
import {createServerClient} from '../lib/supabase/server'

export default async function PrivatePage() {
  const supabase = createServerClient()

  const {data, error} = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p>Collections for {data.user.email}</p>
}
