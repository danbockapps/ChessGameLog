'use client'

import {FC, useEffect, useState} from 'react'
import {createBrowserClient} from '../lib/supabase/client'
import {useRouter} from 'next/navigation'
import {UserResponse} from '@supabase/supabase-js'

const MainMenu: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createBrowserClient()
  const router = useRouter()
  const [user, setUser] = useState<UserResponse>()

  useEffect(() => {
    supabase.auth.getUser().then(setUser)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignout = async () => {
    const {error} = await supabase.auth.signOut()
    if (error) console.log('Error signing out:', error.message)

    console.log('routerpush', {error}, supabase.auth.getUser())
    router.push('/')
  }

  return (
    <div>
      <button onClick={toggleMenu} className="bg-transparent text-white p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-4 top-10 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-700">{user?.data.user?.email}</p>
          </div>
          <button
            onClick={handleSignout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default MainMenu
