export interface StringSchema {
  type: 'string'
  name: string
  title: string
  description?: string
  options?: {
    layout?: 'select' | 'radio'
    options?: {value: string; title: string}[]
  }
}

export interface TextSchema {
  type: 'text'
  name: string
  title: string
  description?: string
}

export type Schema = StringSchema | TextSchema
