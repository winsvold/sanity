/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import historyStore from 'part:@sanity/base/datastore/history'
import * as React from 'react'
import {from, Observable, Subscription} from 'rxjs'
import {map, tap} from 'rxjs/operators'
import {usePaneRouter} from '../../../contexts/PaneRouterContext'
import {mapLegacyEventsToEvents} from '../historyNavigator/mapLegacyEventsToEvents'
import {CURRENT_REVISION_FLAG} from './constants'
import {decodeRevisionRange, encodeRevisionRange, findHistoryEventByRev} from './helpers'
import {
  HistoryRevisionState,
  HistoryEventsState,
  LegacyHistoryEventType,
  RevisionRange
} from './types'

const INITIAL_REVISION: HistoryRevisionState = {
  isLoading: false,
  snapshot: null,
  prevSnapshot: null
}

const INITIAL_HISTORY_STATE: HistoryEventsState = {
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

export function useDocumentHistory({
  documentId,
  urlParams
}: {
  documentId: string
  urlParams: {
    view: string
    rev: string
  }
}) {
  const paneRouter: any = usePaneRouter()
  const selection = decodeRevisionRange(urlParams.rev || null)
  const rev = selection && selection[1]

  // Refs
  const loadedRevRef = React.useRef<string | null>(null)
  const historyEventsSubscriptionRef = React.useRef<Subscription | null>(null)
  const documentRevisionSubscriptionRef = React.useRef<Subscription | null>(null)

  // States
  const [historyState, setHistoryEventsState] = React.useState<HistoryEventsState>({
    ...INITIAL_HISTORY_STATE
  })
  const [revision, setRevision] = React.useState<HistoryRevisionState>(INITIAL_REVISION)

  // Values
  const selectedHistoryEvent = findHistoryEventByRev(rev, historyState.events)
  const selectedHistoryEventIsLatest =
    rev === CURRENT_REVISION_FLAG && selectedHistoryEvent === historyState.events[0]

  // Callbacks

  const setSelection = (selection: RevisionRange) => {
    if (selection) {
      paneRouter.setParams(
        {...paneRouter.params, rev: encodeRevisionRange(selection)},
        {recurseIfInherited: true}
      )
    } else {
      const {rev: revParam, ...routerParams} = paneRouter.params

      if (revParam) {
        paneRouter.setParams(routerParams, {recurseIfInherited: true})
      }
    }
  }

  const openHistory = () => {
    paneRouter.setParams(
      {...paneRouter.params, rev: CURRENT_REVISION_FLAG},
      {recurseIfInherited: true}
    )
  }

  // Load revision
  React.useEffect(() => {
    const prevRev = loadedRevRef.current

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

      loadedRevRef.current = rev

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

      setHistoryEventsState(val => ({...val, isLoading: true}))

      const legacyHistoryEvents$: Observable<LegacyHistoryEventType[]> = historyStore.historyEventsFor(
        documentId
      )

      const historyEvents$ = legacyHistoryEvents$.pipe(map(mapLegacyEventsToEvents))

      historyEventsSubscriptionRef.current = historyEvents$
        .pipe(
          tap(events =>
            setHistoryEventsState(val => ({...val, events, isLoaded: true, isLoading: false}))
          )
        )
        .subscribe()
    }

    if (!rev) {
      // reset history state
      setHistoryEventsState(INITIAL_HISTORY_STATE)

      if (historyEventsSubscriptionRef.current) {
        historyEventsSubscriptionRef.current.unsubscribe()
      }
    }
  }, [rev, historyState.isLoaded, historyState.isLoading, documentId])

  // Unsubscribe from observables on unmount
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

  return {
    historyState,
    openHistory,
    revision,
    selectedHistoryEvent,
    selectedHistoryEventIsLatest,
    selection,
    setSelection
  }
}
