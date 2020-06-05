import {Path, NumberDiff, Maybe} from './types'

export function diffNumber(
  fromValue: Maybe<number>,
  toValue: Maybe<number>,
  path: Path = []
): NumberDiff {
  return {
    type: 'number',
    isChanged: fromValue !== toValue,
    fromValue: fromValue,
    toValue: toValue,
    path
  }
}
