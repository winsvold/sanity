import {ObjectDiff, ObjectInput, DiffState} from '../types'
import {lazyFlatten, lazyDiff} from './lazy'

const ignoredFields = new Set(['_id', '_type', '_createdAt', '_updatedAt', '_rev'])

export function diffObject<A>(fromInput: ObjectInput<A>, toInput: ObjectInput<A>): ObjectDiff<A> {
  const fields: ObjectDiff<A>['fields'] = {}
  let state: DiffState = fromInput === toInput ? 'unchanged' : 'unknown'

  for (let key of fromInput.keys) {
    if (ignoredFields.has(key)) continue

    let fromField = fromInput.get(key)!

    let toField = toInput.get(key)
    if (toField) {
      fields[key] = lazyDiff({type: 'unchanged'}, fromField, toField)
    } else {
      fields[key] = lazyFlatten({type: 'removed', annotation: fromField.annotation}, fromField)
      state = 'changed'
    }
  }

  for (let key of toInput.keys) {
    if (ignoredFields.has(key)) continue

    // Already handled above
    if (fromInput.get(key)) continue

    let toField = toInput.get(key)!
    fields[key] = lazyFlatten({type: 'added', annotation: toField.annotation}, toField)
    state = 'changed'
  }

  return {
    type: 'object',
    state,
    fields
  }
}
