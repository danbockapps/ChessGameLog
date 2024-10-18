import {createServerClient} from './lib/supabase/server'

export default async function Home() {
  const supabase = createServerClient()

  //@ts-ignore
  const qr = await supabase.from('test').select('*').single()

  console.log('qr', qr)

  return <main>You are not logged in.</main>
}
