import {SanityClient} from '@sanity/client'
import {Observable, of} from 'rxjs'
import {map, concatMap, scan, debounceTime} from 'rxjs/operators'
import {collateTransactions, getComputedTransactionCollator} from './collateTransactions'
import {getJsonStream} from './ndjsonStreamer'
import {groupTransactions} from './groupTransactions'
import {mapMutations} from './mapMutations'
import {isTransactionLogEvent, getPublishedId, getDraftId} from './helpers'
import {
  TransactionLogEvent,
  MutationStub,
  NormalizedTransactionLogEvent,
  HistoryTimelineEvent,
  GroupedEvent,
  ComputedHistoryTimelineEvent
} from './types'

export function getTransactions(
  documentId: string,
  client: SanityClient
): Observable<NormalizedTransactionLogEvent> {
  const publishedId = getPublishedId(documentId)
  const draftId = getDraftId(documentId)
  const query = '*[_id in $documentIds]'
  return (
    client.observable
      .listen(
        query,
        {documentIds: [publishedId, draftId]},
        {includeResult: false, events: ['welcome', 'mutation' /*, 'reconnect' */]}
      )
      // @todo handle reconnects gracefully
      .pipe(
        groupTransactions(25),
        concatMap((event: GroupedEvent) =>
          isTransactionLogEvent(event) ? of(event) : getPastTransactions(documentId, client)
        ),
        map((evt: TransactionLogEvent) => ({...evt, timestamp: Date.parse(evt.timestamp)}))
      )
  )
}

export function getCollatedEvents(
  documentId: string,
  client: SanityClient
): Observable<HistoryTimelineEvent[]> {
  return getTransactions(documentId, client).pipe(scan(collateTransactions, []), debounceTime(15))
}

export function getComputedCollatedEvents(
  documentId: string,
  client: SanityClient
): Observable<ComputedHistoryTimelineEvent[]> {
  return getTransactions(documentId, client).pipe(
    scan(getComputedTransactionCollator(documentId), null),
    debounceTime(15),
    map(acc => (acc ? acc.events : []))
  )
}

function getPastTransactions(
  documentId: string,
  client: SanityClient
): Observable<TransactionLogEvent> {
  const publishedId = getPublishedId(documentId)
  const draftId = getDraftId(documentId)
  const documentIds = [publishedId, draftId]
  const dataset = client.config().dataset
  const queryParams = 'effectFormat=mendoza&excludeContent=true&includeIdentifiedDocumentsOnly=true'
  const url = `/data/history/${dataset}/transactions/${publishedId},${draftId}?${queryParams}`
  return getJsonStream(client.getUrl(url)).pipe(
    map((event: TransactionLogEvent) => filterRelevantMutations(event, documentIds))
  )
}

function filterRelevantMutations(
  event: TransactionLogEvent,
  documentIds: string[]
): TransactionLogEvent {
  event.mutations = mapMutations<MutationStub>(event.mutations, {
    create: (op, mut) => documentIds.includes(op._id) && mut,
    createOrReplace: (op, mut) => documentIds.includes(op._id) && mut,
    createIfNotExists: (op, mut) => documentIds.includes(op._id) && mut,
    createSquashed: (op, mut) => documentIds.includes(op.document._id) && mut,
    delete: (op, mut) => documentIds.includes(op.id) && mut,
    patch: (op, mut) => documentIds.includes(op.id) && mut
  }).filter(Boolean)

  return event
}
