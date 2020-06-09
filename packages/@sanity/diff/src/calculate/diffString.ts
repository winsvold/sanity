import {
  diff_match_patch as DiffMatchPatch,
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT
} from 'diff-match-patch'
import {StringDiffSegment, StringDiff, Path, Maybe} from '../types'

const dmp = new DiffMatchPatch()
const dmpOperations: {[key: number]: StringDiffSegment['type']} = {
  [DIFF_EQUAL]: 'unchanged',
  [DIFF_DELETE]: 'removed',
  [DIFF_INSERT]: 'added'
}

export function diffString(
  fromValue: Maybe<string>,
  toValue: Maybe<string>,
  path: Path = []
): StringDiff {
  return {
    type: 'string',
    isChanged: fromValue !== toValue,
    fromValue,
    toValue,
    path,

    // Compute and memoize string segments only when accessed
    get segments(): StringDiffSegment[] {
      const dmpDiffs = dmp.diff_main(fromValue || '', toValue || '')
      dmp.diff_cleanupSemantic(dmpDiffs)
      delete this.segments
      this.segments = dmpDiffs.map(([op, text]) => ({type: dmpOperations[op], text}))
      return this.segments
    }
  }
}
