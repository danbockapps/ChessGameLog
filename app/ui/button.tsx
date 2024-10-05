import React from 'react'
import {Spinner} from './spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  fullWidth?: boolean
  variant?: 'filled' | 'outlined'
  loading?: boolean
}

const filledClasses = 'bg-blue-500 text-white hover:bg-blue-700'
const outlinedClasses =
  'bg-white border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  fullWidth = false,
  variant = 'outlined',
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center h-12 px-4 py-2 font-semibold rounded-lg shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50
        ${variant === 'filled' ? filledClasses : ''} ${variant === 'outlined' ? outlinedClasses : ''}
        ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

export default Button
