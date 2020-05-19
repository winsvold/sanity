import {DiffOrigin} from '../history'

export type DiffType =
  | 'array'
  | 'boolean'
  | 'null'
  | 'number'
  | 'object'
  | 'string'
  | 'typeChange'
  | 'unknown'

interface BaseDiff {
  type: DiffType
  fromValue: unknown
  toValue: unknown
  origin: DiffOrigin
}

export interface StringDiffSegment {
  type: 'unchanged' | 'removed' | 'added'
  text: string
  origin: DiffOrigin
}

export type StringDiff = BaseDiff & {
  type: 'string'
  fromValue: string | undefined | null
  toValue: string | undefined | null
  segments: StringDiffSegment[]
}

export type NumberDiff = BaseDiff & {
  type: 'number'
  fromValue: number | undefined | null
  toValue: number | undefined | null
}

export type BooleanDiff = BaseDiff & {
  type: 'boolean'
  fromValue: boolean | undefined | null
  toValue: boolean | undefined | null
}

export type ObjectDiff<T extends object = object> = BaseDiff & {
  type: 'object'
  fromValue: T | undefined | null
  toValue: T | undefined | null
  fields: {[fieldName: string]: Diff | undefined}
}

export type ArrayDiff = BaseDiff & {
  type: 'array'
  fromValue: unknown[] | undefined | null
  toValue: unknown[] | undefined | null
  items: Diff[]
}

export type UnknownTypeDiff = BaseDiff & {
  type: 'unknown'
}

export type TypeChangeDiff = BaseDiff & {
  type: 'typeChange'
  fromType: DiffType
  toType: DiffType
}

export type Diff =
  | StringDiff
  | NumberDiff
  | BooleanDiff
  | ObjectDiff
  | ArrayDiff
  | UnknownTypeDiff
  | TypeChangeDiff
