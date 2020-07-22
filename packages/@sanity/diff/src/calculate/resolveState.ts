import {Diff} from '../types'

/** resolveState looks at the state and resolves it to either "changed" or "unchanged". */
export function resolveState<A>(diff: Diff<A>): 'changed' | 'unchanged' {
  if (diff.state !== 'unknown') {
    return diff.state
  }

  switch (diff.type) {
    case 'array': {
      for (let elem of diff.elements) {
        if (elem.type === 'added' || elem.type === 'removed' || resolveState(elem.value)) {
          diff.state = 'changed'
          return 'changed'
        }
      }

      diff.state = 'unchanged'
      return 'unchanged'
    }

    case 'object': {
      for (let [_, field] of Object.entries(diff.fields)) {
        if (field.type === 'added' || field.type === 'removed' || resolveState(field.value)) {
          diff.state = 'changed'
          return 'changed'
        }
      }

      diff.state = 'unchanged'
      return 'unchanged'
    }
  }
}
