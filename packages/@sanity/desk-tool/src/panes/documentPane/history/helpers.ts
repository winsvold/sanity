import {WelcomeEvent} from '@sanity/client'
import {CURRENT_REVISION_FLAG} from './constants'
import {
  HistoryTimelineEvent,
  RevisionRange,
  MutationStub,
  CreateMutation,
  CreateOrReplaceMutation,
  CreateIfNotExistsMutation,
  CreateSquashedMutation,
  DeleteMutation,
  PatchMutation,
  TransactionLogEvent
} from './types'

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

export function isCreateMutation(mut: MutationStub): mut is CreateMutation {
  return 'create' in mut
}

export function isCreateOrReplaceMutation(mut: MutationStub): mut is CreateOrReplaceMutation {
  return 'createOrReplace' in mut
}

export function isCreateIfNotExistsMutation(mut: MutationStub): mut is CreateIfNotExistsMutation {
  return 'createIfNotExists' in mut
}

export function isCreateSquashedMutation(mut: MutationStub): mut is CreateSquashedMutation {
  return 'createSquashed' in mut
}

export function isDeleteMutation(mut: MutationStub): mut is DeleteMutation {
  return 'delete' in mut
}

export function isPatchMutation(mut: MutationStub): mut is PatchMutation {
  return 'patch' in mut
}

export function isTransactionLogEvent(
  event: TransactionLogEvent | WelcomeEvent
): event is TransactionLogEvent {
  return 'documentIDs' in event
}

export function getPublishedId(documentId: string): string {
  return documentId.startsWith('drafts.') ? documentId.slice(7) : documentId
}

export function getDraftId(documentId: string): string {
  return documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`
}
