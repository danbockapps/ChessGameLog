import Image from 'next/image'
import {redirect} from 'next/navigation'
import logo from '../public/logo.webp'
import {createServerClient} from './lib/supabase/server'

export default async function Home() {
  const supabase = createServerClient()
  const {data} = await supabase.auth.getUser()

  if (data?.user) redirect('/collections')

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-50 to-gray-100
        text-black"
    >
      <div className="text-center p-8 bg-black bg-opacity-10 rounded-lg shadow-lg">
        <Image
          src={logo}
          alt="chesslog.me Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-4">Welcome to chesslog.me</h1>
        <p className="text-lg mb-6">Log and analyze your chess games.</p>
        <div className="flex space-x-4 justify-center">
          <a href="/login">
            <button
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition
                duration-300"
            >
              Log In
            </button>
          </a>
          <a href="/signup">
            <button
              className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg shadow-md transition
                duration-300"
            >
              Sign Up
            </button>
          </a>
        </div>
      </div>
    </main>
  )
}
