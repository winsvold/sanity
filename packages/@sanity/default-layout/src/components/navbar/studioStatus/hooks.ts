import {useEffect, useState} from 'react'
import {of} from 'rxjs'
import {catchError, startWith, switchMap} from 'rxjs/operators'
import userStore from 'part:@sanity/base/user'
import versionChecker from 'part:@sanity/base/version-checker'
import {Severity} from './types'

export interface State {
  data: {
    helpUrl?: string
    isSupported: boolean
    isUpToDate: boolean
    message?: string
    outdated?: {
      name: string
      latest: string
      severity: Severity
      version: string
    }[]
  } | null
  error: Error | null
  isLoaded: boolean
  isLoading: boolean
}

export function useLatestVersions(): State {
  const [state, setState] = useState<State>({
    error: null,
    isLoaded: false,
    isLoading: false,
    data: null
  })

  useEffect(() => {
    const state$ = userStore.currentUser.pipe(
      switchMap(event => {
        if (event.type === 'snapshot' && event.user && event.user.role === 'administrator') {
          return versionChecker.checkVersions({getOutdated: true}).then(({result}) => {
            return {
              data: result as any,
              error: null,
              isLoaded: true,
              isLoading: false
            }
          })
        }

        return of({data: null, error: null, isLoaded: true, isLoading: false})
      }),
      catchError(err => of({data: null, error: err, isLoaded: true, isLoading: false})),
      startWith({data: null, error: null, isLoaded: true, isLoading: true})
    )

    const sub = state$.subscribe(setState)

    return () => sub.unsubscribe
  }, [])

  return state
}
