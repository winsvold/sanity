import {
  HistoryTimelineEvent,
  MutationStub,
  NormalizedTransactionLogEvent,
  HistoryTimelineEditSessionGroupEvent,
  HistoryTimelineTruncateEvent,
  ComputedHistoryTimelineEvent,
  MendozaPatch,
  PatchMetadata,
  EditSession
} from './types'
import {
  isCreateIfNotExistsMutation,
  isCreateMutation,
  isCreateOrReplaceMutation,
  isCreateSquashedMutation,
  isDeleteMutation,
  isPatchMutation,
  getPublishedId,
  getDraftId,
  isDraftId
} from './helpers'
import {incremental} from 'mendoza/lib'

const EDIT_EVENT_TIME_TRESHOLD_MS = 1000 * 60 * 5 // 5 minutes
const EDIT_SESSION_TIME_TRESHOLD_MS = 1000 * 45 // 45 seconds

const NULL_VALUE = incremental.wrap(null, null)

interface ComputedDocumentState {
  current: incremental.Value
  lastNonNull: incremental.Value
}

interface ComputedAccumulator {
  events: ComputedHistoryTimelineEvent[]
  documents: {
    draft: ComputedDocumentState
    published: ComputedDocumentState
  }
}

export function getComputedTransactionCollator(
  documentId: string
): (
  acc: ComputedAccumulator | null,
  current: NormalizedTransactionLogEvent,
  index: number
) => ComputedAccumulator {
  const publishedId = getPublishedId(documentId)
  const draftId = getDraftId(documentId)
  const initial: ComputedAccumulator = {
    events: [],
    documents: {
      draft: {
        current: NULL_VALUE,
        lastNonNull: NULL_VALUE
      },
      published: {
        current: NULL_VALUE,
        lastNonNull: NULL_VALUE
      }
    }
  }

  return function collateComputedTransactions(
    accum: ComputedAccumulator | null,
    current: NormalizedTransactionLogEvent,
    index: number
  ): ComputedAccumulator {
    const acc = accum || initial
    const draftEffects = current.effects[draftId]
    const publishedEffects = current.effects[publishedId]
    const meta: PatchMetadata = {
      author: current.author,
      rev: current.id,
      timestamp: current.timestamp
    }

    if (draftEffects) {
      acc.documents.draft = applyEffects(acc.documents.draft, draftEffects.apply, meta)
    }

    if (publishedEffects) {
      acc.documents.published = applyEffects(acc.documents.published, publishedEffects.apply, meta)
    }

    const prev = acc.events[acc.events.length - 1]
    const item = getHistoryTimelineItem(current, prev, index)
    const document =
      incremental.getType(acc.documents.draft.current) === 'null'
        ? acc.documents.published.current
        : acc.documents.draft.current

    if (item.type === 'editSession') {
      // @todo Hmmz. Add computed value to each and every session? Or is that too much?
    } else {
      const computed = item as ComputedHistoryTimelineEvent
      computed.value = document
      acc.events.push(computed)
    }

    return acc
  }
}

function applyEffects(
  document: ComputedDocumentState,
  effects: MendozaPatch,
  meta: PatchMetadata
): ComputedDocumentState {
  let newVersion = incremental.applyPatch(document.current, effects, meta)
  if (document.current !== document.lastNonNull) {
    // This is true if `currentValue` is a null value.
    newVersion = incremental.rebaseValue(document.lastNonNull, newVersion)
  }

  if (incremental.getType(newVersion) !== 'null') {
    document.lastNonNull = newVersion
  }

  document.current = newVersion
  return document
}

// @todo this is heavily borrowed from the transaction collator, but _exposes_ the reducer
// pattern, to enable gradual building of the resulting array. It also _mutates_ the array,
// for performance reasons
export function collateTransactions(
  acc: HistoryTimelineEvent[],
  current: NormalizedTransactionLogEvent,
  index: number
): HistoryTimelineEvent[] {
  const prev = acc[acc.length - 1]
  const item = getHistoryTimelineItem(current, prev, index)

  if (item.type !== 'editSession') {
    acc.push(item)
  }

  return acc
}

function getHistoryTimelineItem(
  current: NormalizedTransactionLogEvent,
  prev: HistoryTimelineEvent,
  index: number
): HistoryTimelineEvent | EditSession {
  const {type, documentId} = mutationsToEventTypeAndDocumentId(current.mutations, index)

  // Is the last event (and the current) an edit session - and if it is,
  // is it within what we consider the _same_ session (time-wise)
  if (
    prev &&
    prev.type === 'editSessionGroup' &&
    type === 'edit' &&
    current.timestamp - prev.sessions[prev.sessions.length - 1].endTime <
      EDIT_EVENT_TIME_TRESHOLD_MS
  ) {
    const lastSession = prev.sessions[prev.sessions.length - 1]
    prev.timestamp = current.timestamp // @todo should timestamp be _start_ or _end_ ?

    if (!prev.userIds.includes(current.author)) {
      prev.userIds.push(current.author)
    }

    prev.transactions.push(current)

    // @todo What determines whether or not it goes into the same session or not? is it actually the time?
    if (current.timestamp - lastSession.endTime < EDIT_SESSION_TIME_TRESHOLD_MS) {
      lastSession.edits.push(current.author)
      lastSession.endTime = current.timestamp
      lastSession.length++
      return lastSession
    }

    const session: EditSession = {
      type: 'editSession',
      endTime: current.timestamp,
      length: 1,
      offset: index, // @todo what is this used for, and is using the transaction index correct?
      edits: [current.author]
    }

    prev.sessions.push(session)
    return session
  }

  const baseEvent = {
    displayDocumentId: documentId,
    rev: current.id,
    timestamp: current.timestamp,
    offset: index
  }

  if (type === 'edit' || type === 'editSessionGroup') {
    const event: HistoryTimelineEditSessionGroupEvent = {
      ...baseEvent,
      type: 'editSessionGroup',
      length: 1,
      userIds: [current.author],
      transactions: [current],
      sessions: [
        {
          type: 'editSession',
          endTime: current.timestamp,
          length: 1,
          offset: index,
          edits: [current.author]
        }
      ]
    }

    return event
  }

  if (type === 'truncate') {
    const event: HistoryTimelineTruncateEvent = {
      ...baseEvent,
      type,
      transactions: [current],
      userIds: findUserIds(current, type)
    }

    return event
  }

  return {
    ...baseEvent,
    transactions: [current],
    type,
    userId: current.author
  }
}

export function mutationsToEventTypeAndDocumentId(
  mutations: MutationStub[],
  transactionIndex: number
): {type: HistoryTimelineEvent['type'] | 'edit'; documentId: string | null} {
  const withoutPatches = mutations.filter(mut => !('patch' in mut))

  const createOrReplaceMutation = withoutPatches.find(isCreateOrReplaceMutation)
  const createOrReplaceMut = createOrReplaceMutation && createOrReplaceMutation.createOrReplace

  const createMutation = withoutPatches.find(isCreateMutation)
  const createMut = createMutation && createMutation.create

  const createIfNotExistsMutation = withoutPatches.find(isCreateIfNotExistsMutation)
  const createIfNotExistsMut =
    createIfNotExistsMutation && createIfNotExistsMutation.createIfNotExists

  const deleteMutation = withoutPatches.find(isDeleteMutation)
  const deleteMut = deleteMutation && deleteMutation.delete

  const squashedMutation = withoutPatches.find(isCreateSquashedMutation)
  const squashedMut = squashedMutation && squashedMutation.createSquashed

  const createValue = createOrReplaceMut || createMut || createIfNotExistsMut || null

  // Created
  // @todo this wont work if we start paginating
  if (transactionIndex === 0 && createValue) {
    const documentId = createValue._id
    return {type: 'create', documentId}
  }

  // (re) created
  if (transactionIndex > 0 && mutations.length === 1 && createIfNotExistsMut) {
    const type = isDraftId(createIfNotExistsMut._id) ? 'edit' : 'publish'
    return {type, documentId: createIfNotExistsMut._id}
  }

  // Published
  if (createValue && deleteMut && isDraftId(deleteMut.id)) {
    return {
      type: 'publish',
      documentId: createValue._id
    }
  }

  // Unpublished
  if (
    withoutPatches.length === 2 &&
    (createIfNotExistsMut || createMut) &&
    deleteMut &&
    !isDraftId(deleteMut.id)
  ) {
    return {
      type: 'unpublish',
      documentId: createValue && createValue._id
    }
  }

  // Restored to previous version
  if (
    (createOrReplaceMut && isDraftId(createOrReplaceMut._id)) ||
    (createMut && isDraftId(createMut._id)) ||
    (createIfNotExistsMut && isDraftId(createIfNotExistsMut._id))
  ) {
    return {
      type: 'edit',
      documentId: createValue && createValue._id
    }
  }

  // Discard drafted changes
  if (mutations.length === 1 && deleteMut && isDraftId(deleteMut.id)) {
    return {type: 'discardDraft', documentId: getPublishedId(deleteMut.id)}
  }

  // Truncated history
  if (mutations.length === 1 && squashedMut) {
    return {type: 'truncate', documentId: squashedMut.document._id}
  }

  // Deleted
  if (mutations.every(isDeleteMutation)) {
    return {type: 'delete', documentId: null}
  }

  // Edited
  const patchedMutation = mutations.find(isPatchMutation)
  if (patchedMutation && patchedMutation.patch) {
    return {type: 'edit', documentId: patchedMutation.patch.id}
  }

  // Edited (createOrReplace)
  if (createOrReplaceMut) {
    return {type: 'edit', documentId: createOrReplaceMut._id}
  }

  return {type: 'unknown', documentId: null}
}

function findUserIds(
  transaction: NormalizedTransactionLogEvent,
  type: HistoryTimelineEvent['type'] | 'edit'
): string[] {
  if (type !== 'truncate') {
    // Default is to return the transaction author
    return [transaction.author]
  }

  // The truncated event is kind of special
  const createSquasedMutation = transaction.mutations.find(isCreateSquashedMutation)
  const createSquasedMut = createSquasedMutation && createSquasedMutation.createSquashed
  return createSquasedMut ? createSquasedMut.authors : [transaction.author]
}

/*
@todo reintroduce?
function createReduceTruncatedFn() {
  let truncated: HistoryTimelineEvent[] | undefined
  return (
    acc: HistoryTimelineEvent[],
    current: HistoryTimelineEvent,
    index: number,
    arr: HistoryTimelineEvent[]
  ) => {
    truncated = truncated || arr.filter((event) => event.type === 'truncated')
    if (!truncated.includes(current)) {
      acc.push(current)
    }
    if (index === arr.length - 1) {
      const draftTruncationEvent = truncated.find(
        (evt) => evt.displayDocumentId && isDraftId(evt.displayDocumentId)
      )
      const publishedTruncationEvent = truncated.find(
        (evt) => evt.displayDocumentId && !isDraftId(evt.displayDocumentId)
      )
      if (draftTruncationEvent && publishedTruncationEvent) {
        acc.unshift({...draftTruncationEvent, type: 'edited'})
        acc.unshift(publishedTruncationEvent)
      } else if (publishedTruncationEvent) {
        acc.unshift(publishedTruncationEvent)
      } else if (draftTruncationEvent) {
        acc.unshift(draftTruncationEvent)
      }
    }
    return acc
  }
}
*/
