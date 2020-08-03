import {Path, BooleanDiff, Maybe, SimpleInput, SimpleDiff, DiffOptions} from '../types'

export function diffSimple<A>(
  fromInput: SimpleInput<A>,
  toInput: SimpleInput<A>,
  options: DiffOptions
): SimpleDiff<A> {
  return {
    type: fromInput.type,
    fromValue: fromInput.data,
    toValue: toInput.data,
    state: fromInput.data === toInput.data ? 'unchanged' : 'changed'
  } as SimpleDiff<A>
}
