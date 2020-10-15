import {useEffect, useState} from 'react'
import {of} from 'rxjs'
import {catchError, switchMap} from 'rxjs/operators'
import userStore from 'part:@sanity/base/user'
import VersionChecker from 'part:@sanity/base/version-checker'

interface State {
  error: Error | null
  isLoaded: boolean
  data: {
    outdated: {
      name: string
      latest: string
      severity: 'notice' | 'low' | 'medium' | 'high'
      version: string
    }[]
    isSupported: boolean
    isUpToDate: boolean
  } | null
}

export function useLatestVersions(): State {
  const [state, setState] = useState<State>({error: null, isLoaded: false, data: null})

  useEffect(() => {
    const stream = userStore.currentUser.pipe(
      switchMap(event => {
        if (event.type === 'snapshot' && event.user && event.user.role === 'administrator') {
          return VersionChecker.checkVersions().then(({result}) => ({
            error: null,
            isLoaded: true,
            data: result
          }))
        }

        return of({error: null, isLoaded: false, data: null})
      }),
      catchError(err => of({error: err, isLoaded: true, data: null}))
    )

    const sub = stream.subscribe(setState)

    return () => sub.unsubscribe
  }, [])

  return state
}
