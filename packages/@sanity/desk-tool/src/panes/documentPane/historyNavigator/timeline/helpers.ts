import {RevisionRange} from '../../types'

export function getIsSelected(selection: RevisionRange, revisionId: string): boolean {
  if (!selection) return false
  if (typeof selection === 'string') return selection === revisionId

  return selection.indexOf(revisionId) > -1
}
