import {RevisionRange} from './types'

const KEY_I = 73
const KEY_O = 79

export function isInspectHotkey(event: KeyboardEvent): boolean {
  return event.ctrlKey && event.keyCode === KEY_I && event.altKey && !event.shiftKey
}

export function isPreviewHotkey(event: KeyboardEvent): boolean {
  return event.ctrlKey && event.keyCode === KEY_O && event.altKey && !event.shiftKey
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
