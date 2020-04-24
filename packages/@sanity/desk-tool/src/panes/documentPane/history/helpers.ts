import {CURRENT_REVISION_FLAG} from './constants'
import {HistoryTimelineEvent, RevisionRange} from './types'

export function findHistoryEventByRev(
  rev: string | null,
  events: HistoryTimelineEvent[]
): HistoryTimelineEvent | null {
  if (!rev) return null
  if (rev === CURRENT_REVISION_FLAG) return events[0] || null

  return events.find(event => event.rev === rev) || null
}

const RIGHT_INCLUSIVE_RANGE_LITERAL = '..'

export function decodeRevisionRange(val: string | null): RevisionRange {
  if (!val) return null

  const parts = val.split(RIGHT_INCLUSIVE_RANGE_LITERAL)

  if (parts.length === 1) return [val, val]

  return parts
}

export function encodeRevisionRange(val: RevisionRange): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (val[0] === val[1]) return val[0]

  return val.join(RIGHT_INCLUSIVE_RANGE_LITERAL)
}
