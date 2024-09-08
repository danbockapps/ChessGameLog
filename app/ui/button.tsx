import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({children, className = '', fullWidth = false, ...props}) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}>
      {children}
    </button>
  )
}

export default Button