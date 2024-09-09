'use client'

import {AuthResponse} from '@supabase/supabase-js'
import React, {useState} from 'react'
import {createBrowserClient} from '../lib/supabase/client'
import {Spinner} from '../ui/spinner'
import Button from '../ui/button'

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const supabase = createBrowserClient()

  const disabled = ['loading', 'success'].includes(status)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              {...{disabled}}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              {...{disabled}}
            />
          </div>
          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
          {status === 'success' && (
            <div className="text-green-500 text-sm mb-4">
              Success! Check your email to verify your account.
            </div>
          )}

          <Button
            fullWidth
            onClick={(e) => {
              e.preventDefault()
              setStatus('loading')
              setErrorMessage('')

              supabase.auth
                .signUp({email, password})
                .then((data: AuthResponse) => {
                  console.log('data', data)

                  if (data.error) {
                    setErrorMessage(data.error.message)
                    setStatus('error')
                  } else {
                    setStatus('success')
                  }
                })
                .catch((error: Error) => {
                  console.log('error')
                  console.error({error})
                  setStatus('error')
                  setErrorMessage(error.message)
                })
            }}
            type="submit"
            loading={status === 'loading'}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  )
}

export default SignUpPage
