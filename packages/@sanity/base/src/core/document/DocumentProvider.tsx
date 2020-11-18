import React from 'react'
import {DocumentContext} from './DocumentContext'

export function DocumentProvider({children, id}: {children?: React.ReactNode; id: string}) {
  return <DocumentContext.Provider value={{id}}>{children}</DocumentContext.Provider>
}
