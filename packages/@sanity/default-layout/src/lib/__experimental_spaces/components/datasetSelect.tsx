import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import {ChevronDownIcon} from '@sanity/icons'
import {useRouter} from 'part:@sanity/base/router'
import React, {useCallback} from 'react'
import {CONFIGURED_SPACES} from '../constants'
import {useCurrentSpace} from '../hooks'
import {Space} from '../types'

function DatasetSelectMenuItem({openSpace, space}: {openSpace: (s: Space) => void; space: Space}) {
  const handleClick = useCallback(() => openSpace(space), [openSpace, space])

  return <MenuItem onClick={handleClick} text={space.title} />
}

export function DatasetSelect() {
  const router = useRouter()
  const {currentSpace} = useCurrentSpace()

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
