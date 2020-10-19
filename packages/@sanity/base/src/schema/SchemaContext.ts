import {createContext} from 'react'
import {Schema} from '@sanity/types'

/**
 * @alpha
 */
export interface SchemaContextInstance {
  schema: Schema
}

/**
 * @alpha
 */
export const SchemaContext = createContext<SchemaContextInstance>({
  get schema(): Schema {
    throw new Error('Schema not provided')
  }
})
