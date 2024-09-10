import {createServerClient} from '@/app/lib/supabase/server'
import Link from 'next/link'

export default async function Collection({params: {id}}: {params: {id: string}}) {
  const supabase = createServerClient()
  // TODO auth check

  const {data} = await supabase.from('games').select().eq('collection', id)

  return (
    <div className="p-4">
      <Link href="/collections">⬅️ Collections</Link>
      <div>{data?.map((game) => game.pgn)}</div>
    </div>
  )
}
