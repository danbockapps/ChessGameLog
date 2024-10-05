interface Props {
  title: string
  description: string
}

export const captionClassNames = 'text-xs text-gray-500'

const SectionHeader: React.FC<Props> = ({title, description}) => {
  return (
    <div>
      <h3 className="text-lg pb-1">{title}</h3>
      <p className={`${captionClassNames} pb-3`}>{description}</p>
    </div>
  )
}

export default SectionHeader
