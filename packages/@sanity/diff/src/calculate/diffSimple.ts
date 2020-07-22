import {Path, BooleanDiff, Maybe, SimpleInput, SimpleDiff} from '../types'

export function diffSimple<A>(
  fromInput: SimpleInput<A>,
  toInput: SimpleInput<A>,
): SimpleDiff<A> {
  return {
    type: fromInput.type,
    fromValue: fromInput.data,
    toValue: toInput.data,
    state: fromInput.data === toInput.data ? 'unchanged' : 'changed'
  } as SimpleDiff<A>
}
