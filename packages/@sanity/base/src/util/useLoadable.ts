import {useEffect, useRef, useState} from 'react'
import {Observable, Subscription} from 'rxjs'

export type LoadableState<T> = LoadingState | LoadedState<T> | ErrorState

export interface LoadingState {
  data: undefined
  error: undefined
  loading: true
}

export interface LoadedState<T> {
  data: T
  error: undefined
  loading: false
}

export interface ErrorState {
  data: undefined
  error: Error
  loading: false
}

export function useLoadable<T>(observable$: Observable<T>): LoadableState<T>
export function useLoadable<T>(observable$: Observable<T>, initialValue: T): LoadableState<T>
export function useLoadable<T>(observable$: Observable<T>, initialValue?: T): LoadableState<T> {
  const isInitial = useRef(true)
  const subscription = useRef<Subscription>()
  const [state, setState] = useState<LoadableState<T>>(() => {
    let isSync = true
    let syncVal: LoadableState<T> =
      typeof initialValue === 'undefined'
        ? {loading: true, data: undefined, error: undefined}
        : {loading: false, data: initialValue, error: undefined}

    subscription.current = observable$.subscribe(
      data => {
        const nextState: LoadedState<T> = {
          data,
          error: undefined,
          loading: false
        }

        if (isSync) {
          syncVal = nextState
        } else {
          setState(nextState)
        }
      },
      error => {
        setState({data: undefined, error, loading: false})
      }
    )

    isSync = false

    return syncVal
  })

  // When `initialValue` or `observable$` changes
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }

    if (subscription.current) {
      subscription.current.unsubscribe()
    }

    setState(
      typeof initialValue === 'undefined'
        ? {loading: true, data: undefined, error: undefined}
        : {loading: false, data: initialValue, error: undefined}
    )

    subscription.current = observable$.subscribe(
      data => {
        setState({data, error: undefined, loading: false})
      },
      error => {
        setState({data: undefined, error, loading: false})
      }
    )
  }, [initialValue, observable$])

  // On unmount
  useEffect(
    () => () => {
      if (subscription.current) {
        subscription.current.unsubscribe()
      }
    },
    []
  )

  return state
}
