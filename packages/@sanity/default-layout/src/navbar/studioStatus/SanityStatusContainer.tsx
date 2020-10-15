import React, {useCallback, useState} from 'react'
import versions from 'sanity:versions'
import {SanityStatus} from './SanityStatus'
import {useLatestVersions} from './hooks'
import {Package, Severity} from './types'

const levels: Array<Severity> = ['low', 'medium', 'high']

const getHighestLevel = (outdated: Package[]) =>
  outdated.reduce((acc, pkg) => Math.max(acc, levels.indexOf(pkg.severity)), 0)

export function SanityStatusContainer() {
  const [open, setOpen] = useState(false)
  const latestVersions = useLatestVersions()

  const handleHideDialog = useCallback(() => setOpen(false), [])
  const handleShowDialog = useCallback(() => setOpen(true), [])

  if (latestVersions.error) {
    return null
  }

  if (!latestVersions.isLoaded) {
    return null
  }

  const {outdated, isSupported, isUpToDate} = latestVersions.data
  const level = levels[getHighestLevel(outdated || [])]

  return (
    <SanityStatus
      isSupported={isSupported}
      isUpToDate={isUpToDate}
      level={level}
      showDialog={open}
      onHideDialog={handleHideDialog}
      onShowDialog={handleShowDialog}
      outdated={outdated}
      versions={versions}
    />
  )
}
