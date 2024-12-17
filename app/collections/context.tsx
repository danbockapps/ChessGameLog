'use client'

import {User} from '@supabase/supabase-js'
import {createContext, FC, PropsWithChildren, useContext} from 'react'

interface AppContextType {
  user: User
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface ProviderProps {
  initialValue: User
}

export const AppContextProvider: FC<PropsWithChildren<ProviderProps>> = (props) => (
  <AppContext.Provider value={{user: props.initialValue}}>{props.children}</AppContext.Provider>
)

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
