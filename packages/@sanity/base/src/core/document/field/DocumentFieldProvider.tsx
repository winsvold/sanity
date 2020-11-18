import React from 'react'
import {Schema} from '../../schema'
import {DocumentFieldContext} from './DocumentFieldContext'

export function DocumentFieldProvider({
  children,
  id,
  path = [],
  schema,
}: {
  children?: React.ReactNode
  id: string
  path: string[]
  schema: Schema
}) {
  return (
    <DocumentFieldContext.Provider value={{id, path, schema}}>
      {children}
    </DocumentFieldContext.Provider>
  )
}
