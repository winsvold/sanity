import {useEffect, useState} from 'react'
import {map} from 'rxjs/operators'
import {urlState$} from '../../datastores/urlState'
import {CONFIGURED_SPACES} from './constants'
import {Space} from './types'

const currentSpace$ = urlState$.pipe(
  map(event => event.state && event.state.space),
  map(spaceName => CONFIGURED_SPACES.find(sp => sp.name === spaceName))
)

export function useCurrentSpace(): {
  currentSpace: Space | null
  setCurrentSpace: (space: Space | null) => void
} {
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null)

  useEffect(() => {
    const sub = currentSpace$.subscribe(setCurrentSpace)

    return () => sub.unsubscribe()
  }, [])

  return {currentSpace, setCurrentSpace}
}
