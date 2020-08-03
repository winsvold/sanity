import {TypeChangeDiff, Input, DiffOptions} from '../types'

export function diffTypeChange<A>(
  fromInput: Input<A>,
  toInput: Input<A>,
  options: DiffOptions
): TypeChangeDiff<A> {
  return {
    type: 'typeChange',
    fromValue: fromInput,
    toValue: toInput,
    fromType: fromInput.type,
    toType: toInput.type,
    state: 'changed'
  }
}
