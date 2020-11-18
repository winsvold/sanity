import {createContext} from 'react'
import {Schema} from '../../schema'

export const DocumentFieldContext = createContext<{
  id: string
  path: string[]
  schema: Schema
} | null>(null)
