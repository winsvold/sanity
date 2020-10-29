import {useEffect, useState} from 'react'
import {maybeRedirectToBase} from './router'
import {urlState$} from './controller'

interface URLState {
  intent?: {
    name: string
    params: {[key: string]: string}
  }
  isNotFound?: boolean
  state?: Record<string, any>
}

export function useUrlState(): URLState {
  const [state, setState] = useState<URLState>({})

  useEffect(() => {
    maybeRedirectToBase()

    const sub = urlState$.subscribe({
      next: event =>
        setState({
          state: event.state,
          isNotFound: event.isNotFound,
          intent: event.intent
        })
    })

    return () => sub.unsubscribe()
  }, [])

  return state
}
