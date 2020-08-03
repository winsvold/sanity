export type Maybe<T> = T | null | undefined

export type DiffOptions = {}

export type Diff<A> = StringDiff<A> | NumberDiff<A> | BooleanDiff<A> | NullDiff<A> | ObjectDiff<A> | ArrayDiff<A> | TypeChangeDiff<A>
export type SimpleDiff<A> = StringDiff<A> | NumberDiff<A> | BooleanDiff<A> | NullDiff<A>
export type ValueType = 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'undefined'

export type PathSegment = string | number | {_key: string}
export type Path = PathSegment[]

export type SimpleInput<T> = StringInput<T> | NumberInput<T> | BooleanInput<T> | NullInput<T>

export type Input<T> = SimpleInput<T> | ObjectInput<T> | ArrayInput<T>

export interface BaseInput<A> {
  annotation: A
}

export interface StringInput<A> extends BaseInput<A> {
  type: 'string'
  data: string
  sliceAnnotation(start: number, end: number): {text: string, annotation: A}[]
}

export interface NumberInput<A> extends BaseInput<A> {
  type: 'number'
  data: number | null
}

export interface BooleanInput<A> extends BaseInput<A> {
  type: 'boolean'
  data: boolean | null
}

export interface NullInput<A> extends BaseInput<A> {
  type: 'null'
  data: null
}

export interface ObjectInput<A> extends BaseInput<A> {
  type: 'object'
  keys: string[]
  get(key: string): Input<A> | undefined
}

export interface ArrayInput<A> extends BaseInput<A> {
  type: 'array'
  length: number
  at(idx: number): Input<A>
}

export type Added<T, A> = {
  type: 'added'
  value: T
  annotation: A
}

export type Removed<T, A> = {
  type: 'removed'
  value: T
  annotation: A
}

export type Unchanged<T> = {
  type: 'unchanged'
  value: T
}

export type StringDiffSegment<A> = Added<string, A> | Removed<string, A> | Unchanged<string>

export type ItemDiffSegment<A> = Added<unknown, A> | Removed<unknown, A> | Unchanged<Diff<A>>

export type DiffState = 'changed' | 'unchanged' | 'unknown'

interface BaseDiff {
  type: 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'typeChange'
  state: DiffState
}

export interface StringDiff<A> extends BaseDiff {
  type: 'string'
  state: 'changed' | 'unchanged'
  segments: StringDiffSegment<A>[]
}

export interface NumberDiff<A> extends BaseDiff {
  type: 'number'
  state: 'changed' | 'unchanged'
  fromValue: Maybe<number>
  toValue: Maybe<number>
}

export interface BooleanDiff<A> extends BaseDiff {
  type: 'boolean'
  state: 'changed' | 'unchanged'
  fromValue: Maybe<boolean>
  toValue: Maybe<boolean>
}

export interface ObjectDiff<A> extends BaseDiff {
  type: 'object'
  fields: {[fieldName: string]: ItemDiffSegment<A>}
}

export interface ArrayDiff<A> extends BaseDiff {
  type: 'array'
  elements: ItemDiffSegment<A>[]
}

export interface NullDiff<A> extends BaseDiff {
  type: 'null'
  state: 'unchanged'
  fromValue: null
  toValue: null
}

export interface TypeChangeDiff<A> extends BaseDiff {
  type: 'typeChange'
  state: 'changed'
  fromValue: unknown
  fromType: ValueType
  toValue: unknown
  toType: ValueType
}
