import {FC} from 'react'
import Card from './card'

interface Props {
  title: string
  children: React.ReactNode
  className?: string
}

const CollectionCard: FC<Props> = (props) => (
  <Card className={`w-96 h-48 ${props.className ?? ''}`}>
    <div className="bg-gray-800 text-white p-2 rounded-t-lg">{props.title}</div>
    <div className="p-4">{props.children}</div>
  </Card>
)

export default CollectionCard
