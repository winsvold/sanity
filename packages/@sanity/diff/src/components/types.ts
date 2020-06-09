import {Diff} from '../types'

export type DiffComponent<T extends Diff = Diff> = React.ComponentType<DiffProps<T>>

export type DiffProps<T extends Diff = Diff> = T & {
  schemaType: SchemaType<T>
}

export interface ObjectField {
  name: string
  title: string
  type: SchemaType
}

interface ToDecl {
  name: string
}

export interface SchemaType<T extends Diff = Diff> {
  name: string
  title?: string
  jsonType: string
  type?: SchemaType<T>
  to?: ToDecl[]
  diffComponent?: DiffComponent<T>
  fields?: ObjectField[]
}
