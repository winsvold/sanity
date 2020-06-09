import {ValueType, StringDiff, Diff} from '../types'

export function getType(item: unknown): ValueType {
  if (Array.isArray(item)) {
    return 'array'
  }

  if (item === null) {
    return 'null'
  }

  const type = typeof item
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'object':
    case 'undefined':
      return type
    default:
      throw new Error(`Unsupported type passed to differ: ${type}`)
  }
}

export function isStringDiff(thing: Diff): thing is StringDiff {
  return thing && thing.type === 'string'
}

export function isNullish(thing: unknown): boolean {
  return thing === null || typeof thing === 'undefined'
}
