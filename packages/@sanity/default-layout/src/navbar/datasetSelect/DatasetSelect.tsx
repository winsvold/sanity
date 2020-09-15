import ChevronDownIcon from 'part:@sanity/base/chevron-down-icon'
import {useRouter} from 'part:@sanity/base/router'
import React, {useCallback, useEffect, useState} from 'react'
import {map} from 'rxjs/operators'
import {state as urlState} from '../../datastores/urlState'
import {CONFIGURED_SPACES} from '../../util/spaces'

import styles from './DatasetSelect.css'

interface DatasetSelectProps {
  isVisible: boolean
  tone?: 'navbar'
}

const currentSpace$ = urlState.pipe(
  map(event => event.state && event.state.space),
  map(spaceName => CONFIGURED_SPACES.find(sp => sp.name === spaceName))
)

export default function DatasetSelect(props: DatasetSelectProps) {
  const {isVisible, tone} = props
  const router = useRouter()
  const [currentSpace, setCurrentSpace] = useState(null)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      router.navigate({space: event.target.value})
      window.location.reload()
    },
    [router]
  )

  useEffect(() => {
    const sub = currentSpace$.subscribe(setCurrentSpace)
    return () => sub.unsubscribe()
  }, [])

  return (
    <div aria-hidden={!isVisible} className={styles.root} data-tone={tone}>
      <select
        onChange={handleChange}
        tabIndex={isVisible ? 0 : -1}
        value={(currentSpace && currentSpace.name) || undefined}
      >
        {CONFIGURED_SPACES.map(space => (
          <option key={space.name} value={space.name}>
            {space.title}
          </option>
        ))}
      </select>

      <ChevronDownIcon />
    </div>
  )
}
