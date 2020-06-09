import {Path, TypeChangeDiff} from '../types'
import {getType} from './getType'

export function diffTypeChange(
  fromValue: unknown,
  toValue: unknown,
  path: Path = []
): TypeChangeDiff {
  return {
    type: 'typeChange',
    path,
    fromValue,
    toValue,
    fromType: getType(fromValue),
    toType: getType(toValue),
    isChanged: fromValue !== toValue
  }
}
