import {useId} from '@reach/auto-id'
import {Button} from '@sanity/ui'
import React from 'react'
import CurrentVersionsDialog from './CurrentVersionsDialog'
import UpdateNotifierDialog from './UpdateNotifierDialog'
import {Package, Severity} from './types'

interface SanityStatusProps {
  isSupported: boolean
  isUpToDate: boolean
  level: Severity
  onHideDialog: () => void
  onShowDialog: () => void
  outdated?: Package[]
  showDialog: boolean
  versions: {[key: string]: string}
}

function formatUpdateLabel(len: number) {
  if (len === 1) return ' 1 update'
  return `${len} updates`
}

export function SanityStatus(props: SanityStatusProps) {
  const {
    isSupported,
    isUpToDate,
    level,
    onHideDialog,
    onShowDialog,
    outdated = [],
    showDialog,
    versions
  } = props
  const elementId = useId()
  const currentLevel: Severity = outdated.length ? level : 'notice'
  const severity: Severity = isSupported ? currentLevel : 'high'

  return (
    <>
      {showDialog && (
        <div role="dialog" aria-modal="true" aria-labelledby={elementId}>
          {isUpToDate ? (
            <CurrentVersionsDialog onClose={onHideDialog} versions={versions} />
          ) : (
            <UpdateNotifierDialog onClose={onHideDialog} outdated={outdated} severity={severity} />
          )}
        </div>
      )}
      {!isUpToDate && (
        <Button
          aria-label={`${formatUpdateLabel(outdated.length)}, ${severity} severity level.`}
          icon="package"
          // iconStatus="primary"
          id={elementId}
          mode="bleed"
          onClick={onShowDialog}
          padding={2}
          selected={showDialog}
          // tone="navbar"
        />
      )}
    </>
  )
}
