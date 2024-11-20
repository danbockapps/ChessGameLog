import {redirect} from 'next/navigation'
import {createServerClient} from './lib/supabase/server'

export default async function Home() {
  const supabase = createServerClient()

  //@ts-ignore
  const qr = await supabase.from('test').select('*').single()

  console.log('qr', qr)

  const {data} = await supabase.auth.getUser()

  if (data?.user) redirect('/collections')

  return <main>You are not logged in.</main>
}
