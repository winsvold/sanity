import {useUser} from '@sanity/base/hooks'
import userStore from 'part:@sanity/base/user'
import {useCallback} from 'react'

export function useCurrentUser() {
  const state = useUser('me')

  const logout = useCallback(() => {
    userStore.actions.logout()
  }, [])

  return {...state, logout}
}
