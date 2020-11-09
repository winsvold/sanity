import {ValidationList} from '@sanity/base/__legacy/components'
import {Button, MenuButton} from '@sanity/ui'
import {ErrorOutlineIcon} from '@sanity/icons'
import React, {useCallback} from 'react'

interface ValidationMenuProps {
  boundaryElement: HTMLDivElement | null
  isOpen: boolean
  // @todo: replace with type from @sanity/types
  markers: any[]
  schemaType: any
  setFocusPath: (path: any) => void
  setOpen: (val: boolean) => void
}

export function ValidationMenu(props: ValidationMenuProps) {
  const {boundaryElement, isOpen, markers, schemaType, setFocusPath, setOpen} = props
  const validationMarkers = markers.filter(marker => marker.type === 'validation')
  const validationErrorMarkers = validationMarkers.filter(marker => marker.level === 'error')
  const validationWarningwarnings = validationMarkers.filter(marker => marker.level === 'warning')

  const handleClose = useCallback(() => setOpen(false), [setOpen])

  if (validationErrorMarkers.length === 0 && validationWarningwarnings.length === 0) {
    return null
  }

  const popoverContent = (
    <ValidationList
      documentType={schemaType}
      markers={validationMarkers}
      onClose={handleClose}
      onFocus={setFocusPath}
      // showLink
    />
  )

  return (
    <MenuButton
      boundaryElement={boundaryElement || undefined}
      button={
        <Button
          color={validationErrorMarkers.length > 0 ? 'danger' : 'warning'}
          // kind='simple'
          mode="bleed"
          icon={ErrorOutlineIcon}
          padding={2}
          selected={isOpen}
          title={'Show validation issues'}
        />
      }
      id="validation-menu"
      menu={popoverContent}
      // open={isOpen}
      placement="bottom"
      // setOpen={setOpen}
    />
  )
}
