import {createServerClient} from './lib/supabase/server'

export default async function Home() {
  console.time('fetch')
  const lichessData = await fetch('https://lichess.org/api/player').then((res) => res.json())
  console.timeEnd('fetch')

  const supabase = createServerClient()

  const {data, error} = await supabase.auth.getUser()

  console.log({data, error})

  const {data: users, error: usersError} = await supabase.from('profiles').select()

  console.log({users, usersError})

  return <main>{JSON.stringify(lichessData)}</main>
}
