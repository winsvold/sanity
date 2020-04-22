/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react'
import {formatDate} from '../format'
import {HistoryTimelineEditSessionGroupEvent} from '../types'

import styles from './EditSessionGroupEvent.css'

interface Props {
  event: HistoryTimelineEditSessionGroupEvent
  now: number
  onOpenRevision: (rev: string) => void
  selectedRev?: string
}

export function EditSessionGroupEvent({event, now, onOpenRevision, selectedRev}: Props) {
  const isSelected = event.rev === selectedRev

  const handleHeaderClick = () => {
    onOpenRevision(event.rev)
  }

  return (
    <div className={isSelected ? styles.isSelected : styles.root}>
      <button onClick={handleHeaderClick} type="button">
        <div className={styles.iconContainer} />
        <div className={styles.heading}>Edited</div>
        <div className={styles.dateline}>{formatDate(now, event.timestamp)}</div>
      </button>
    </div>
  )
}
