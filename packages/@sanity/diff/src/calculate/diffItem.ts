import {Path, Diff, ValueType, Maybe, SanityObject} from '../types'
import {getType, isNullish} from './getType'
import {diffArray} from './diffArray'
import {diffBoolean} from './diffBoolean'
import {diffString} from './diffString'
import {diffNumber} from './diffNumber'
import {diffTypeChange} from './diffTypeChange'
import {diffObject} from './diffObject'

export function diffItem(fromValue: unknown, toValue: unknown, path: Path = []): Diff | undefined {
  const fromType = getType(fromValue)
  const toType = getType(toValue)

  // eg: null/undefined => string
  if (isNullish(fromValue) && !isNullish(toValue)) {
    return diffWithType(toType, fromValue, toValue, path)
  }

  // eg: number => null/undefined
  if (!isNullish(fromValue) && isNullish(toValue)) {
    return diffWithType(fromType, fromValue, toValue, path)
  }

  // eg: array => array
  if (fromType === toType) {
    return diffWithType(toType, fromValue, toValue, path)
  }

  // eg: number => string
  return diffTypeChange(fromValue, toValue, path)
}

function diffWithType(
  type: ValueType,
  fromValue: unknown,
  toValue: unknown,
  path: Path
): Diff | undefined {
  switch (type) {
    case 'array':
      return diffArray(fromValue as Maybe<unknown[]>, toValue as Maybe<unknown[]>, path)
    case 'boolean':
      return diffBoolean(fromValue as Maybe<boolean>, toValue as Maybe<boolean>, path)
    case 'number':
      return diffNumber(fromValue as Maybe<number>, toValue as Maybe<number>, path)
    case 'string':
      return diffString(fromValue as Maybe<string>, toValue as Maybe<string>, path)
    case 'object':
      return diffObject(fromValue as Maybe<SanityObject>, toValue as Maybe<SanityObject>, path)
    default:
      // eg: null => null / undefined => null
      return undefined
  }
}
