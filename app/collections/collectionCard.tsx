import Link from 'next/link'
import {FC} from 'react'
import Card from '../ui/card'

interface Props {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

const CollectionCard: FC<Props> = (props) => (
  <Link href={`/collections/${props.id}`}>
    <Card className={`w-96 h-48 ${props.className ?? ''}`}>
      <div className="bg-gray-800 text-white p-2 rounded-t-lg">{props.title}</div>
      <div className="p-4">{props.children}</div>
    </Card>
  </Link>
)

export default CollectionCard