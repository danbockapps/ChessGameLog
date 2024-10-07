import {redirect} from 'next/navigation'
import {createServerClient} from './lib/supabase/server'

export default async function Home() {
  const supabase = createServerClient()

  const {data} = await supabase.auth.getUser()

  if (data?.user) redirect('/collections')

  return <main>You are not logged in.</main>
}
