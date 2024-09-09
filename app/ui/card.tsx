interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({children, className = ''}) => {
  return <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
}

export default Card
