import userStore from 'part:@sanity/base/user'
import {useEffect, useState} from 'react'
import {User} from './types'

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)

  // Subscribe to current user
  useEffect(() => {
    const sub = userStore.currentUser.subscribe(event =>
      setUser(event.type === 'snapshot' ? event.user : null)
    )

    return () => {
      sub.unsubscribe()
    }
  }, [])

  return {data: user, logout: userStore.actions.logout}
}
