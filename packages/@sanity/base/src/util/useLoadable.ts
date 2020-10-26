import * as React from 'react'
import {Observable, Subscription} from 'rxjs'

export type LoadableState<T> = LoadingState<T> | LoadedState<T> | ErrorState<T>

export interface LoadingState<T> {
  data: undefined
  error: undefined
  isLoading: true
}

export interface LoadedState<T> {
  data: T
  error: undefined
  isLoading: false
}

export interface ErrorState<T> {
  data: undefined
  error: Error
  isLoading: false
}

export function useLoadable<T>(observable$: Observable<T>): LoadableState<T>
export function useLoadable<T>(observable$: Observable<T>, initialValue: T): LoadableState<T>
export function useLoadable<T>(observable$: Observable<T>, initialValue?: T): LoadableState<T> {
  const subscription = React.useRef<Subscription>()
  const [value, setState] = React.useState<LoadableState<T>>(() => {
    let isSync = true
    let syncVal: LoadableState<T> =
      typeof initialValue === 'undefined'
        ? {isLoading: true, data: undefined, error: undefined}
        : {isLoading: false, data: initialValue, error: undefined}

    subscription.current = observable$.subscribe(
      nextVal => {
        const nextState: LoadedState<T> = {
          isLoading: false,
          data: nextVal,
          error: undefined
        }

        if (isSync) {
          syncVal = nextState
        } else {
          setState(nextState)
        }
      },
      error => {
        setState({isLoading: false, error, data: undefined})
      }
    )

    isSync = false
    return syncVal
  })

  React.useEffect(
    () => () => {
      if (subscription.current) {
        subscription.current.unsubscribe()
      }
    },
    []
  )

  return value
}
