import {createServerClient} from '@/app/lib/supabase/server'
import Link from 'next/link'
import {insertChesscomGames} from './actions'

export default async function Collection({params: {id}}: {params: {id: string}}) {
  const supabase = createServerClient()
  // TODO auth check

  const {data} = await supabase.from('games').select().eq('collection', id)

  await insertChesscomGames(id)

  return (
    <div className="p-4">
      <Link href="/collections">⬅️ Collections</Link>
      <div>{data?.map((game) => '')}</div>
    </div>
  )
}
