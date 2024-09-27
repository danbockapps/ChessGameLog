'use client'

import {FC, useState} from 'react'
import importChesscomGames from './actions/importChesscomGames'
import importLichessGames from './actions/importLichessGames'
import Button from '@/app/ui/button'

interface Props {
  collectionId: string
  site: 'chess.com' | 'lichess'
  username: string
  lastRefreshed: Date | null
}

const RefreshButton: FC<Props> = ({collectionId, site, username, lastRefreshed}) => {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)
    if (site === 'chess.com') await importChesscomGames(collectionId, lastRefreshed, username)
    if (site === 'lichess') await importLichessGames(collectionId, lastRefreshed, username)
    setLoading(false)
  }

  return <Button {...{onClick, loading}}>Refresh</Button>
}

export default RefreshButton
