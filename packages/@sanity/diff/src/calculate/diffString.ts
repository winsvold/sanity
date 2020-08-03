import {
  diff_match_patch as DiffMatchPatch,
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT
} from 'diff-match-patch'
import {StringDiffSegment, StringDiff, StringInput, DiffOptions} from '../types'

const dmp = new DiffMatchPatch()

export function diffString<A>(
  fromInput: StringInput<A>,
  toInput: StringInput<A>,
  options: DiffOptions
): StringDiff<A> {
  return {
    type: 'string',
    state: fromInput.data === toInput.data ? 'unchanged' : 'changed',

    // Compute and memoize string segments only when accessed
    get segments(): StringDiffSegment<A>[] {
      const dmpDiffs = dmp.diff_main(fromInput.data, toInput.data)
      dmp.diff_cleanupSemantic(dmpDiffs)
      delete this.segments
      let segments: StringDiffSegment<A>[] = (this.segments = [])

      let fromIdx = 0
      let toIdx = 0

      for (let [op, text] of dmpDiffs) {
        switch (op) {
          case DIFF_EQUAL:
            segments.push({type: 'unchanged', value: text})
            fromIdx += text.length
            toIdx += text.length
            break
          case DIFF_DELETE:
            for (let segment of fromInput.sliceAnnotation(fromIdx, fromIdx + text.length)) {
              segments.push({
                type: 'removed',
                value: segment.text,
                annotation: segment.annotation
              })
            }
            fromIdx += text.length
            break
          case DIFF_INSERT:
            for (let segment of toInput.sliceAnnotation(toIdx, toIdx + text.length)) {
              segments.push({
                type: 'added',
                value: segment.text,
                annotation: segment.annotation
              })
            }
            toIdx += text.length
            break
        }
      }

      return this.segments
    }
  }
}
