import {ComponentType} from 'react'
import {Diff, Annotation} from '@sanity/diff'

export type DiffComponent<T extends Diff = Diff<Annotation>> = ComponentType<DiffProps<T>>

export type DiffProps<T extends Diff = Diff> = T & {
  schemaType: SchemaType<T>
}

export interface ObjectField {
  name: string
  title: string
  type: SchemaType
}

export interface SchemaType<T extends Diff = Diff> {
  name: string
  title?: string
  jsonType: string
  type?: SchemaType<T>
  to?: {name: string}[]
  diffComponent?: DiffComponent<T>
  fields?: ObjectField[]
}
