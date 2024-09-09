interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({children, className = '', onClick}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`} {...{onClick}}>
      {children}
    </div>
  )
}

export default Card
