'use client'

import {useRouter} from 'next/navigation'
import {createBrowserClient} from '../lib/supabase/client'
import Button from './button'

export default function SignOutButton() {
  const supabase = createBrowserClient()
  const router = useRouter()

  const handleSignout = async () => {
    const {error} = await supabase.auth.signOut()
    if (error) console.log('Error signing out:', error.message)

    console.log('routerpush', {error}, supabase.auth.getUser())
    router.push('/')
  }

  return <Button onClick={handleSignout}>Sign out</Button>
}
