import {createClient} from './lib/supabase/server'

export default async function Home() {
  console.time('fetch')
  const lichessData = await fetch('https://lichess.org/api/player').then((res) => res.json())
  console.timeEnd('fetch')

  const supabase = createClient()

  const {data, error} = await supabase.auth.getUser()

  console.log({data, error})

  return <main>{JSON.stringify(lichessData)}</main>
}
