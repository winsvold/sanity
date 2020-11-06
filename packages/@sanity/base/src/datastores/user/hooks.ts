import userStore from 'part:@sanity/base/user'
import {useMemo} from 'react'
import {LoadableState, useLoadable} from '../../util/useLoadable'
import {User} from './types'

export function useUser(userId: string): LoadableState<User> {
  const user$ = useMemo(() => userStore.observable.getUser(userId), [userId])

  return useLoadable(user$)
}
