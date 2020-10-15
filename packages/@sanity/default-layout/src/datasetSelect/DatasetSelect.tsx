import {Menu, MenuButton, MenuItem} from '@sanity/ui'
import {ChevronDownIcon} from '@sanity/icons'
import {useRouter} from 'part:@sanity/base/router'
import React, {useCallback, useEffect, useState} from 'react'
import {map} from 'rxjs/operators'
import {state as urlState} from '../datastores/urlState'
import {CONFIGURED_SPACES} from '../util/spaces'

interface Space {
  default: boolean
  name: string
  title: string
}

interface DatasetSelectProps {
  isVisible: boolean
  tone?: 'navbar'
}

const currentSpace$ = urlState.pipe(
  map(event => event.state && event.state.space),
  map(spaceName => CONFIGURED_SPACES.find(sp => sp.name === spaceName))
)

export default DatasetSelect

function DatasetSelect(props: DatasetSelectProps) {
  const router = useRouter()
  const {isVisible, tone} = props
  const tabIndex = isVisible ? 0 : -1
  const [currentSpace, setCurrentSpace] = useState<Space | null>()

  useEffect(() => {
    const sub = currentSpace$.subscribe(setCurrentSpace)

    return () => sub.unsubscribe()
  }, [])

  const openSpace = useCallback(
    (space: Space) => {
      router.navigate({space: space.name})

      setTimeout(() => window.location.reload(), 0)
    },
    [router]
  )

  if (!currentSpace) return null

  return (
    <MenuButton
      aria-hidden={!isVisible}
      id="dataset-menu"
      menu={
        <Menu>
          {CONFIGURED_SPACES.map(space => (
            <MenuItem key={space.name} onClick={() => openSpace(space)}>
              {space.title}
            </MenuItem>
          ))}
        </Menu>
      }
      mode="ghost"
      // tabIndex={tabIndex}
      // tone={tone}
    >
      {currentSpace.title} <ChevronDownIcon />
    </MenuButton>
  )
}
