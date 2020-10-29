import {useId} from '@reach/auto-id'
import {Button} from '@sanity/ui'
import React, {useCallback, useState} from 'react'
import versions from 'sanity:versions'
import CurrentVersionsDialog from './CurrentVersionsDialog'
import {getHighestLevel} from './helpers'
import {State} from './hooks'
import {Severity} from './types'
import UpdateNotifierDialog from './UpdateNotifierDialog'

interface SanityStatusProps {
  latestVersions: State
}

function formatUpdateLabel(len: number) {
  if (len === 1) return ' 1 update'
  return `${len} updates`
}

console.log(versions)

export function SanityStatus(props: SanityStatusProps) {
  const {latestVersions} = props
  const {outdated = [], isSupported, isUpToDate} = latestVersions.data
  const [open, setOpen] = useState(false)
  const handleHideDialog = useCallback(() => setOpen(false), [])
  const handleShowDialog = useCallback(() => setOpen(true), [])
  const level = getHighestLevel(outdated || [])
  const elementId = useId()
  const currentLevel: Severity = outdated.length ? level : 'notice'
  const severity: Severity = isSupported ? currentLevel : 'high'

  if (latestVersions.error) {
    return null
  }

  if (!latestVersions.isLoaded) {
    return null
  }

  return (
    <>
      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby={elementId}>
          {isUpToDate ? (
            <CurrentVersionsDialog onClose={handleHideDialog} versions={versions} />
          ) : (
            <UpdateNotifierDialog
              onClose={handleHideDialog}
              outdated={outdated}
              severity={severity}
            />
          )}
        </div>
      )}

      {!isUpToDate && (
        <Button
          aria-label={`${formatUpdateLabel(outdated.length)}, ${severity} severity level.`}
          icon="package"
          // iconStatus="brand"
          id={elementId}
          mode="bleed"
          onClick={handleShowDialog}
          padding={3}
          selected={open}
        />
      )}
    </>
  )
}
