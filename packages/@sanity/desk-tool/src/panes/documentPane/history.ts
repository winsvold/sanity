/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import historyStore from 'part:@sanity/base/datastore/history'
import * as React from 'react'
import {from, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {CURRENT_REVISION_FLAG} from '../../constants'
import {HistoricalDocumentState, HistoryState} from './types'

const INITIAL_REVISION: HistoricalDocumentState = {
  isLoading: false,
  snapshot: null,
  prevSnapshot: null
}

const INITIAL_HISTORY_STATE: HistoryState = {
  isLoading: false,
  isLoaded: false,
  error: null,
  events: []
}

const DEBUG_HISTORY_TRANSITION = false

function debugHistory(...args: any[]) {
  if (DEBUG_HISTORY_TRANSITION) {
    const logLine = typeof args[0] === 'string' ? `[HISTORY] ${args[0]}` : '[HISTORY] '
    // eslint-disable-next-line no-console
    console.log(logLine, ...args.slice(1))
  }
}

function findHistoryEventByRev(rev: string | null, events: any[]) {
  return rev === CURRENT_REVISION_FLAG
    ? events[0]
    : events.find(event => event.rev === rev || event.transactionIds.includes(rev))
}

export function useDocumentHistory({documentId, rev}: {documentId: string; rev: string | null}) {
  const revRef = React.useRef<string | null>(null)

  const [historyState, setHistoryState] = React.useState<HistoryState>({
    ...INITIAL_HISTORY_STATE
  })

  const [revision, setRevision] = React.useState<HistoricalDocumentState>(INITIAL_REVISION)

  const historyEventsSubscriptionRef = React.useRef<Subscription | null>(null)
  const documentRevisionSubscriptionRef = React.useRef<Subscription | null>(null)

  const selectedHistoryEvent = findHistoryEventByRev(rev, historyState.events)
  const selectedHistoryEventIsLatest =
    rev === CURRENT_REVISION_FLAG && selectedHistoryEvent === historyState.events[0]

  // Load revision
  React.useEffect(() => {
    const prevRev = revRef.current

    if (!rev || rev === CURRENT_REVISION_FLAG) {
      // No revision ID to load

      if (prevRev) {
        // Unload previous revision
        setRevision(INITIAL_REVISION)
      }
      return
    }

    if (!historyState.isLoaded) {
      debugHistory('History events are not loaded, so cannot load revision yet')
      return
    }

    // Check if the revision ID was changed
    if (rev !== prevRev) {
      const event = findHistoryEventByRev(rev, historyState.events)

      revRef.current = rev

      if (!event) {
        debugHistory(
          'Could not find history event %s',
          rev ? `with revisionId ${rev}` : ' (selected)'
        )
        return
      }

      if (event.type === 'unknown') {
        debugHistory('Encountered unknown event type: %s', event.type)
        return
      }

      if (!event.displayDocumentId) {
        debugHistory('Missing display document ID: %s', event.type)
        return
      }

      setRevision(val => ({
        ...val,
        snapshot: null,
        prevSnapshot: val.snapshot || val.prevSnapshot,
        isLoading: true
      }))

      const {displayDocumentId: eventDocumentId, rev: eventRev} = event

      debugHistory('Fetch document revision with (revisionId=%s)', eventRev)

      if (documentRevisionSubscriptionRef.current) {
        documentRevisionSubscriptionRef.current.unsubscribe()
      }

      const documentRevision$ = from(historyStore.getDocumentAtRevision(eventDocumentId, eventRev))

      documentRevisionSubscriptionRef.current = documentRevision$.subscribe({
        next(newSnapshot: any) {
          setRevision(val => ({
            ...val,
            isLoading: false,
            snapshot: newSnapshot,
            prevSnapshot: null
          }))
        },
        error(err) {
          console.log(err)
        }
      })
    }
  }, [rev, historyState.events])

  // Load history events
  React.useEffect(() => {
    if (rev && !historyState.isLoaded && !historyState.isLoading) {
      debugHistory('Load history events')

      if (historyEventsSubscriptionRef.current) {
        historyEventsSubscriptionRef.current.unsubscribe()
      }

      setHistoryState(val => ({...val, isLoading: true}))

      historyEventsSubscriptionRef.current = historyStore
        .historyEventsFor(documentId)
        .pipe(
          tap((events: any) => {
            setHistoryState(val => ({...val, events, isLoaded: true, isLoading: false}))
          })
        )
        .subscribe()
    }

    if (!rev) {
      // reset history state
      setHistoryState(INITIAL_HISTORY_STATE)

      if (historyEventsSubscriptionRef.current) {
        historyEventsSubscriptionRef.current.unsubscribe()
      }
    }
  }, [rev, historyState.isLoaded, historyState.isLoading, documentId])

  // Unsubscribe from observables
  React.useEffect(() => {
    return () => {
      if (historyEventsSubscriptionRef.current) {
        historyEventsSubscriptionRef.current.unsubscribe()
      }

      if (documentRevisionSubscriptionRef.current) {
        documentRevisionSubscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  return {historyState, revision, selectedHistoryEvent, selectedHistoryEventIsLatest}
}
