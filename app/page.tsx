import {redirect} from 'next/navigation'
import {createServerClient} from './lib/supabase/server'

export default async function Home() {
  console.log('Home')

  const supabase = createServerClient()

  //@ts-ignore
  const qr = await supabase.from('test').select('*').single()

  console.log('qr', qr)

  return <main>{JSON.stringify(qr)}</main>
}
