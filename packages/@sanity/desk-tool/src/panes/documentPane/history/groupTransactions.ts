/**
 * Observable operator that turns listener mutation events into a transaction log entry.
 * Keeps the last seen item in memory for X milliseconds and when a subsequent event
 * is received, checks if it's part of the same transaction as the previous event.
 * If so, merges the two to a single event (like in the transaction log).
 * If no event is received within X milliseconds, the staged event is flushed.
 */
import {Observable, OperatorFunction, Operator, Subscriber, TeardownLogic} from 'rxjs'
import {MutationEvent} from '@sanity/client'
import {mapMutations} from './mapMutations'
import {
  TransactionLogEvent,
  MendozaEffectPair,
  ListenEvent,
  GroupedEvent,
  MutationStub
} from './types'

export function groupTransactions(maxWait: number): OperatorFunction<ListenEvent, GroupedEvent> {
  return function groupTransactionsOperatorFunction(
    source: Observable<ListenEvent>
  ): Observable<GroupedEvent> {
    return source.lift(new GroupTransactionsOperator<ListenEvent>(maxWait))
  }
}

function mutationEventToTransactionLogEvent(
  event: MutationEvent & {effects?: MendozaEffectPair}
): TransactionLogEvent {
  return {
    id: event.transactionId,
    author: event.identity,
    documentIDs: [event.documentId],
    timestamp: event.timestamp,
    mutations: reduceMutations(event),
    effects: {[event.documentId]: event.effects}
  }
}

class GroupTransactionsOperator<T> implements Operator<T, GroupedEvent> {
  private maxWait = 100

  constructor(maxWait: number) {
    this.maxWait = maxWait
  }

  call(subscriber: Subscriber<GroupedEvent>, source: any): TeardownLogic {
    return source.subscribe(new GroupTransactionsSubscriber(subscriber, this.maxWait))
  }
}

class GroupTransactionsSubscriber extends Subscriber<ListenEvent> {
  private timeout: any // can't deal with this right now
  private previous: MutationEvent = undefined
  protected destination: Subscriber<GroupedEvent>

  constructor(destination: Subscriber<GroupedEvent>, private maxWait: number) {
    super(destination)
    this.destination = destination
  }

  private _flush = (): void => {
    this.destination.next(mutationEventToTransactionLogEvent(this.previous))
    this.previous = null
  }

  protected _next(value: ListenEvent): void {
    if (value.type !== 'mutation') {
      this.destination.next(value)
      return
    }

    if (this.timeout) {
      this.timeout = clearTimeout(this.timeout)
    }

    // Nothing to compare to? Stage it for flushing
    if (!this.previous) {
      this.previous = value
      this.timeout = setTimeout(this._flush, this.maxWait)
      return
    }

    // Are they of the same transaction? Group them!
    if (value.transactionId === this.previous.transactionId) {
      const prevEvent = mutationEventToTransactionLogEvent(this.previous)
      const nextEvent = mutationEventToTransactionLogEvent(value)
      this.destination.next({
        ...nextEvent,
        documentIDs: [this.previous.documentId, value.documentId],
        effects: {
          ...prevEvent.effects,
          ...nextEvent.effects
        }
      })
      this.previous = null
      return
    }

    // Not of the same transaction? Flush the previous value, keep the new,
    // then schedule a flush of that, too
    this.destination.next(mutationEventToTransactionLogEvent(this.previous))
    this.previous = value
    this.timeout = setTimeout(this._flush, this.maxWait)
  }

  protected _complete(): void {
    if (this.previous) {
      this.destination.next(mutationEventToTransactionLogEvent(this.previous))
      this.previous = null
    }

    super._complete()
  }
}

function reduceMutations(event: MutationEvent): MutationStub[] {
  const mutations = event.mutations as MutationStub[]
  return mapMutations<MutationStub>(mutations, {
    create: ({_id}) => ({create: {_id}}),
    createSquashed: ({document}) => ({createSquashed: {document: {_id: document._id}}}),
    createOrReplace: ({_id}) => ({createOrReplace: {_id}}),
    createIfNotExists: ({_id}) => ({createIfNotExists: {_id}}),
    delete: ({id}) => ({delete: {id}}),
    patch: ({id}) => ({patch: {id}})
  })
}
