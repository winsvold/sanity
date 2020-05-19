/* eslint-disable @typescript-eslint/explicit-function-return-type */

import client from 'part:@sanity/base/client'
import historyStore from 'part:@sanity/base/datastore/history'
import * as React from 'react'
import {from, Observable, Subscription} from 'rxjs'
import {usePaneRouter} from '../../../contexts/PaneRouterContext'
import {Doc} from '../types'
import {getMendozaDiff} from './getMendozaDiff'
import {CURRENT_REVISION_FLAG} from './constants'
import {getCollatedEvents} from './transactionLog'
import {decodeRevisionRange, encodeRevisionRange, findHistoryEventByRev} from './helpers'
import {
  ComputedDiff,
  HistoryEventsState,
  HistoryRevisionState,
  HistorySelectionRange,
  HistoryTimelineEvent,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debug(...args: any[]) {
  if (DEBUG_HISTORY_TRANSITION) {
    const logLine = typeof args[0] === 'string' ? `[HISTORY] ${args[0]}` : '[HISTORY] '
    // eslint-disable-next-line no-console
    console.log(logLine, ...args.slice(1))
  }
}

function fetchRevision(documentId: string, rev: string): Observable<Doc> {
  debug(`Fetching revision=${rev}`)

  const promise: Promise<Doc> = historyStore.getDocumentAtRevision(documentId, rev)

  return from(promise)
}

export function useDocumentHistory({
  documentId,
  urlParams,
  draft,
  published
}: {
  documentId: string
  urlParams: {
    view: string
    rev: string
  }
  draft: Doc | null
  published: Doc | null
}) {
  const paneRouter = usePaneRouter()

  // Refs
  const toRevRef = React.useRef<string | null>(null)
  const fromRevRef = React.useRef<string | null>(null)
  const toRevSubRef = React.useRef<Subscription | null>(null)
  const fromRevSubRef = React.useRef<Subscription | null>(null)
  const historyEventsSubscriptionRef = React.useRef<Subscription | null>(null)
  const documentRevisionSubscriptionRef = React.useRef<Subscription | null>(null)

  // States
  const [historyState, setHistoryEventsState] = React.useState<HistoryEventsState>({
    ...INITIAL_HISTORY_STATE
  })
  const [toRevision, setToRevision] = React.useState<HistoryRevisionState>(INITIAL_REVISION)
  const [fromRevision, setFromRevision] = React.useState<HistoryRevisionState>(INITIAL_REVISION)
  const [diff, setDiff] = React.useState<ComputedDiff | undefined>(undefined)

  // Values
  const selection = React.useMemo(() => decodeRevisionRange(urlParams.rev || null), [urlParams.rev])
  const range = React.useMemo((): HistorySelectionRange => {
    const {events} = historyState
    const leftRev = selection && Array.isArray(selection) ? selection[0] : selection
    const rightRev = selection && Array.isArray(selection) ? selection[1] : selection
    const leftEvent = findHistoryEventByRev(leftRev, events)
    const rightEvent = findHistoryEventByRev(rightRev, events)
    const leftIndex = leftEvent ? events.indexOf(leftEvent) : -1
    const rightIndex = rightEvent ? events.indexOf(rightEvent) : -1

    if (leftIndex < rightIndex) {
      return {
        from: {index: rightIndex, rev: rightRev, event: rightEvent},
        to: {index: leftIndex, rev: leftRev, event: leftEvent}
      }
    }

    return {
      from: {index: leftIndex, rev: leftRev, event: leftEvent},
      to: {index: rightIndex, rev: rightRev, event: rightEvent}
    }
  }, [historyState.events, selection])

  React.useEffect(() => {
    const computed = getMendozaDiff(documentId, historyState.events || [], range, {
      draft,
      published
    })
    if (computed !== diff) {
      setDiff(computed)
    }
  }, [documentId, historyState.events, draft, published])

  const revision = React.useMemo(() => {
    // `from` and `to` are the same
    if (range.from.rev === range.to.rev) {
      return {from: toRevision, to: toRevision}
    }

    return {from: fromRevision, to: toRevision}
  }, [fromRevision, toRevision])

  const selectedHistoryEvent = React.useMemo(
    () => findHistoryEventByRev(range.to.rev, historyState.events),
    [range.to.rev, historyState.events]
  )
  const selectedHistoryEventIsLatest =
    range.to.rev === CURRENT_REVISION_FLAG && selectedHistoryEvent === historyState.events[0]

  // React.useEffect(() => {
  //   console.log('range', range.from.index, range.to.index)
  // }, [range])

  // Callbacks

  const setSelection = React.useCallback(
    (newSelection: RevisionRange) => {
      if (newSelection) {
        paneRouter.setParams(
          {...paneRouter.params, rev: encodeRevisionRange(newSelection)},
          {recurseIfInherited: true}
        )
      } else {
        const {rev: revParam, ...newParams} = paneRouter.params

        if (revParam) {
          paneRouter.setParams(newParams, {recurseIfInherited: true})
        }
      }
    },
    [paneRouter, selection]
  )

  const openHistory = React.useCallback(() => {
    paneRouter.setParams(
      {...paneRouter.params, rev: CURRENT_REVISION_FLAG},
      {recurseIfInherited: true}
    )
  }, [paneRouter])

  const loadRev = (
    subRef: React.MutableRefObject<Subscription | null>,
    revRef: React.MutableRefObject<string | null>,
    event: HistoryTimelineEvent | null,
    rev: string | null,
    setRevision: React.Dispatch<React.SetStateAction<HistoryRevisionState>>
  ) => {
    debug(`Attempt to load revision=${rev}`)

    const prevRev = revRef.current

    if (!rev || selectedHistoryEventIsLatest) {
      debug('No revision ID to load')

      if (prevRev) {
        debug('Unload current loaded revision')
        setRevision(INITIAL_REVISION)
      }
      return
    }

    if (!historyState.isLoaded) {
      debug('History events are not loaded, so cannot load revision yet')
      return
    }

    // Check if the revision ID was changed
    if (rev !== prevRev) {
      revRef.current = rev

      if (!event) {
        debug('Could not find event with revision=%s', rev)
        return
      }

      if (event.type === 'unknown') {
        debug('Encountered unknown event:', event)
        return
      }

      if (!event.displayDocumentId) {
        debug(`Event of type=${event.type} is missing displayDocumentId`)
        return
      }

      setRevision(val => ({
        ...val,
        snapshot: null,
        prevSnapshot: val.snapshot || val.prevSnapshot,
        isLoading: true
      }))

      if (subRef.current) {
        subRef.current.unsubscribe()
      }

      subRef.current = fetchRevision(event.displayDocumentId, event.rev).subscribe({
        next(snapshot) {
          setRevision(val => ({
            ...val,
            isLoading: false,
            snapshot,
            prevSnapshot: null
          }))
        },
        error(err: Error) {
          setRevision(val => ({
            ...val,
            error: err,
            isLoading: false
          }))
        }
      })
    }
  }

  // Load `to` revision
  React.useEffect(() => {
    loadRev(toRevSubRef, toRevRef, range.to.event, range.to.rev, setToRevision)
  }, [range, historyState.isLoaded, selectedHistoryEventIsLatest])

  // Load `from` revision
  React.useEffect(() => {
    if (range.from.rev === range.to.rev) {
      loadRev(fromRevSubRef, fromRevRef, null, null, setFromRevision)
    } else {
      loadRev(fromRevSubRef, fromRevRef, range.from.event, range.from.rev, setFromRevision)
    }
  }, [range, historyState.isLoaded, selectedHistoryEventIsLatest])

  // Load history events
  React.useEffect(() => {
    if (range.to.rev && !historyState.isLoaded && !historyState.isLoading) {
      debug('Load history events')

      if (historyEventsSubscriptionRef.current) {
        historyEventsSubscriptionRef.current.unsubscribe()
      }

      setHistoryEventsState(val => ({...val, isLoading: true}))

      const historyEvents$ = getCollatedEvents(documentId, client)
      historyEventsSubscriptionRef.current = historyEvents$.subscribe(events =>
        setHistoryEventsState(val => ({
          ...val,
          events: events.reverse(),
          isLoaded: true,
          isLoading: false
        }))
      )
    }

    if (!range.to.rev) {
      debug('Reset history events')

      // reset history state
      setHistoryEventsState(INITIAL_HISTORY_STATE)

      if (historyEventsSubscriptionRef.current) {
        historyEventsSubscriptionRef.current.unsubscribe()
      }
    }
  }, [range.to.rev, historyState.isLoaded, historyState.isLoading, documentId])

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
    selectionRange: range,
    revision,
    selectedHistoryEvent,
    selectedHistoryEventIsLatest,
    selection,
    setSelection,
    diff
  }
}
