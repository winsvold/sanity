import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import {ChevronDownIcon} from '@sanity/icons'
import {useRouter} from 'part:@sanity/base/router'
import React, {useCallback, useEffect, useState} from 'react'
import {map} from 'rxjs/operators'
import {urlState$} from './datastores/urlState'
import {CONFIGURED_SPACES} from './util/spaces'

interface Space {
  default: boolean
  name: string
  title: string
}

const currentSpace$ = urlState$.pipe(
  map(event => event.state && event.state.space),
  map(spaceName => CONFIGURED_SPACES.find(sp => sp.name === spaceName))
)

function DatasetSelectMenuItem({openSpace, space}: {openSpace: (s: Space) => void; space: Space}) {
  const handleClick = useCallback(() => openSpace(space), [openSpace, space])

  return <MenuItem onClick={handleClick} text={space.title} />
}

export function DatasetSelect() {
  const router = useRouter()
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
      button={
        <Button
          mode="ghost"
          text={
            <>
              {currentSpace.title} <ChevronDownIcon />
            </>
          }
        />
      }
      id="dataset-menu"
      menu={
        <Menu>
          {CONFIGURED_SPACES.map(space => (
            <DatasetSelectMenuItem key={space.name} openSpace={openSpace} space={space} />
          ))}
        </Menu>
      }
    />
  )
}
