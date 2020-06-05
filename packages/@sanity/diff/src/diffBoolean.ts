import {Path, BooleanDiff, Maybe} from './types'

export function diffBoolean(
  fromValue: Maybe<boolean>,
  toValue: Maybe<boolean>,
  path: Path = []
): BooleanDiff {
  return {
    type: 'boolean',
    isChanged: fromValue !== toValue,
    fromValue: fromValue,
    toValue: toValue,
    path
  }
}
