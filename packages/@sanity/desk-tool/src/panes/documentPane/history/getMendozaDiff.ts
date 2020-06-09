/* eslint-disable max-depth, no-labels */
import {applyPatch, incremental} from 'mendoza'
import {
  HistoryTimelineEvent,
  HistorySelectionRange,
  MendozaEffectPair,
  NormalizedTransactionLogEvent,
  ComputedDiff
} from './types'
import {Doc} from '../types'
import {getPublishedId, getDraftId, isDraftId} from './helpers'

type DiffOrigin = any // @todo

type Documents = {draft: Doc | null; published: Doc | null}

class IncrementalPatcher {
  private publishedId: string
  private draftId: string
  private draft: incremental.Value
  private published: incremental.Value
  private lastNonNull: incremental.Value

  constructor(baseDocument: Doc | null, documentId: string) {
    const isDraft = baseDocument && isDraftId(baseDocument._id || '')
    this.publishedId = getPublishedId(documentId)
    this.draftId = getDraftId(this.publishedId)
    this.draft = incremental.wrap({...withoutRev(baseDocument), _id: this.draftId}, null)
    this.published = incremental.wrap({...withoutRev(baseDocument), _id: this.publishedId}, null)
    this.lastNonNull = isDraft ? this.draft : this.published
  }

  apply(
    patches: Record<string, MendozaEffectPair | undefined>,
    direction: 'apply' | 'revert',
    origin: DiffOrigin
  ): void {
    const draftEffects = patches[this.draftId]
    const publishedEffects = patches[this.publishedId]

    const draftPatch = draftEffects && draftEffects[direction]
    const publishedPatch = publishedEffects && publishedEffects[direction]

    const isPublish = Boolean(
      draftPatch && draftPatch[0] === 0 && draftPatch[1] === null && publishedPatch
    )

    if (!isPublish && draftPatch && draftPatch.length > 0) {
      let newDraft = incremental.applyPatch(this.draft, draftPatch, origin)
      if (this.draft !== this.lastNonNull) {
        newDraft = incremental.rebaseValue(this.lastNonNull, newDraft)
      }

      if (incremental.getType(newDraft) !== 'null') {
        this.lastNonNull = newDraft
      }

      this.draft = newDraft
    }

    // If a change happens to a published document while a draft exists,
    // pretend like it didn't happen?
    if (publishedPatch && incremental.getType(this.draft) !== 'null') {
      return
    }

    if (publishedPatch && publishedPatch.length > 0) {
      let newPublished = incremental.applyPatch(this.published, publishedPatch, origin)
      if (this.published !== this.lastNonNull) {
        newPublished = incremental.rebaseValue(this.lastNonNull, newPublished)
      }

      if (incremental.getType(newPublished) !== 'null') {
        this.lastNonNull =
          incremental.getType(this.draft) === 'null' ? newPublished : this.lastNonNull
      }

      this.published = newPublished
    }
  }

  getDocument(): incremental.Value {
    return incremental.getType(this.draft) === 'null' ? this.published : this.draft
  }
}

class Patcher {
  private publishedId: string
  private draftId: string
  private draft: Doc | null
  private published: Doc | null
  private originalRev: string | undefined

  constructor(currentDocuments: Documents) {
    this.publishedId = currentDocuments.draft
      ? getPublishedId(currentDocuments.draft._id || '')
      : (currentDocuments.published && currentDocuments.published._id) || ''
    this.draftId = getDraftId(this.publishedId)
    this.draft = withoutRev(currentDocuments.draft)
    this.published = withoutRev(currentDocuments.published)
    this.originalRev = currentDocuments.draft
      ? currentDocuments.draft._rev
      : currentDocuments.published?._rev
  }

  apply(
    patches: Record<string, MendozaEffectPair | undefined>,
    direction: 'apply' | 'revert'
  ): void {
    const draftEffects = patches[this.draftId]
    const publishedEffects = patches[this.publishedId]

    const draftPatch = draftEffects && draftEffects[direction]
    const publishedPatch = publishedEffects && publishedEffects[direction]

    if (draftPatch && draftPatch.length > 0) {
      this.draft = applyPatch(this.draft, draftPatch)
    }

    if (publishedPatch && publishedPatch.length > 0) {
      this.published = applyPatch(this.published, publishedPatch)
    }
  }

  getDocument(): Doc | null {
    return this.draft || this.published
  }

  getOriginalRevision(): string {
    return this.originalRev || ''
  }
}

export function getMendozaDiff(
  documentId: string,
  events: HistoryTimelineEvent[],
  range: HistorySelectionRange,
  currentDocuments: Documents
): ComputedDiff | undefined {
  if (!events.length || (!currentDocuments.draft && !currentDocuments.published)) {
    // @todo handle
    return undefined
  }

  /**
   * We need to recreate the document at "from" revision
   * We'll use it as the "base value" and apply the patches between `from` => `to`
   *
   * To recreate it, we have three options:
   *
   * a) Ask the API to recreate it at the given revision
   * b) Reconstruct the document based on the "current" version and
   *    applying the `revert` patches down to `from`
   * c) Reconstruct the document based from an empty state by applying
   *    _all_ `apply` patches from the origin of the document, up to `from`
   *
   * We _usually_ have the "current" version of the document available,
   * and we may not always want to retrieve _all_ the transactions, since
   * that's potentially an enormous amount.
   *
   * While option C might make sense if the from and to are very old transactions,
   * it's more likely that the user wants to view recent history (eg draft vs published)
   *
   * Let's start with option B and see where it takes us.
   **/

  const patcher = new Patcher(currentDocuments)

  // Events should be sorted in DESCENDING timestamp order
  const initialDoc = patcher.getDocument() as Doc // Can't both be null at this time
  const initialRev = patcher.getOriginalRevision()

  let foundCurrent = false
  const transactions: NormalizedTransactionLogEvent[] = []

  loopEvents: for (const event of events) {
    // Transactions are in ASCENDING order
    for (let i = event.transactions.length - 1; i >= 0; i--) {
      const trx = event.transactions[i]

      // We _might_ end up in a situation where we have newer transactions than the
      // passed document is at. In this case, let's only apply our reverse patches
      // once we've found that revision, or they won't properly apply
      foundCurrent = foundCurrent || trx.id === initialRev
      if (!foundCurrent) {
        continue
      }

      transactions.push(trx)
      patcher.apply(trx.effects, 'revert')
      if (trx.id === range.from.rev) {
        break loopEvents
      }
    }
  }

  if (!foundCurrent) {
    throw new Error(`Failed to find transaction "${initialDoc._rev}"`)
  }

  const fromDocument = patcher.getDocument()
  const incPatcher = new IncrementalPatcher(fromDocument, documentId)

  for (let i = transactions.length - 1; i >= 0; i--) {
    const trx = transactions[i]
    incPatcher.apply(trx.effects, 'apply', {
      userId: trx.author,
      revision: trx.id,
      timestamp: trx.timestamp
    })
  }

  const toDocument = incPatcher.getDocument()
  return {from: fromDocument, to: incremental.unwrap(toDocument), value: toDocument}
}

function withoutRev(original: Doc | null): Omit<Doc, '_rev'> | null {
  if (!original) {
    return original
  }

  const {_rev, ...doc} = original
  return doc
}
