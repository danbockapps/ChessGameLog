import {Link} from '@mui/material'

interface Props {
  title: string
  description: string
  link?: {text: string; onClick: () => void}
}

export const captionClassNames = 'text-xs text-gray-500'

const SectionHeader: React.FC<Props> = ({title, description, link}) => {
  return (
    <div>
      <h3 className="text-lg pb-1">{title}</h3>
      <p className={`${captionClassNames} pb-3`}>
        {description}

        {link && (
          <Link sx={{marginLeft: '10px'}} onClick={link.onClick}>
            {link.text}
          </Link>
        )}
      </p>
    </div>
  )
}

export default SectionHeader
