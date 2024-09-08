import {redirect} from 'next/navigation'
import {createServerClient} from './lib/supabase/server'

export default async function Home() {
  console.log('Home')
  console.time('fetch')
  const lichessData = await fetch('https://lichess.org/api/player').then((res) => res.json())
  console.timeEnd('fetch')

  const supabase = createServerClient()

  const {data} = await supabase.auth.getUser()

  if (data?.user) redirect('/collections')

  return <main>{JSON.stringify(lichessData)}</main>
}
