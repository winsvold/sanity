export type Maybe<T> = T | null | undefined

export type Diff = StringDiff | NumberDiff | BooleanDiff | ObjectDiff | ArrayDiff | TypeChangeDiff
export type ValueType = 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'undefined'

export type PathSegment = string | number | {_key: string}
export type Path = PathSegment[]

type DiffOrigin = {
  userId: string
  timestamp: number
  revision: string
}

interface BaseDiff {
  type: 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'typeChange'
  fromValue: unknown
  toValue: unknown
  path: Path
  isChanged: boolean
}

export interface StringDiffSegment {
  type: 'unchanged' | 'removed' | 'added'
  text: string
}

export type StringDiff = BaseDiff & {
  type: 'string'
  fromValue: Maybe<string>
  toValue: Maybe<string>
  segments: StringDiffSegment[]
}

export type NumberDiff = BaseDiff & {
  type: 'number'
  fromValue: Maybe<number>
  toValue: Maybe<number>
}

export type BooleanDiff = BaseDiff & {
  type: 'boolean'
  fromValue: Maybe<boolean>
  toValue: Maybe<boolean>
}

export type ObjectDiff<T extends object = object> = BaseDiff & {
  type: 'object'
  fromValue: Maybe<T>
  toValue: Maybe<T>
  fields: {[fieldName: string]: Diff}
}

export type ArrayDiff<T = unknown> = BaseDiff & {
  type: 'array'
  fromValue: Maybe<T[]>
  toValue: Maybe<T[]>
  items: Diff[]
}

export type TypeChangeDiff = BaseDiff & {
  type: 'typeChange'
  fromType: ValueType
  toType: ValueType
}

export interface KeyedSanityObject {
  [key: string]: unknown
  _key: string
}

export type SanityObject = KeyedSanityObject | Record<string, unknown>
