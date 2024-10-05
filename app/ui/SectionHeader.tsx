interface Props {
  title: string
  description: string
}

const SectionHeader: React.FC<Props> = ({title, description}) => {
  return (
    <div>
      <h3 className="text-lg pb-1">{title}</h3>
      <p className="text-xs text-gray-500 pb-3">{description}</p>
    </div>
  )
}

export default SectionHeader
