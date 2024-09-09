import React from 'react'
import {Spinner} from './spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  fullWidth = false,
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center h-12 px-4 py-2 bg-blue-500 text-white font-semibold
        rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400
        focus:ring-opacity-75 disabled:opacity-50 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

export default Button
