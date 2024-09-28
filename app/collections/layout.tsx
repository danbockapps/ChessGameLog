import {createServerClient} from '../lib/supabase/server'
import MainMenu from './mainMenu'

export default async function Layout({children}: Readonly<{children: React.ReactNode}>) {
  const supabase = createServerClient()

  const {
    data: {user},
  } = await supabase.auth.getUser()

  return user ? (
    <>
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-950 text-white h-16 pl-4">
        <h1 className="text-xl font-bold">ChessLog</h1>
        <MainMenu {...{user}} />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-100">{children}</div>
    </>
  ) : (
    <>Please log in to continue.</>
  )
}
