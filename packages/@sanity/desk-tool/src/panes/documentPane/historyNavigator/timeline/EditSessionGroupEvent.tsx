/* eslint-disable @typescript-eslint/explicit-function-return-type */

import classNames from 'classnames'
import EditIcon from 'part:@sanity/base/edit-icon'
import * as React from 'react'
import {formatDate} from '../format'
import {HistoryTimelineEditSessionGroupEvent} from '../types'
import EditSessionList from './EditSessionList'

import styles from './EditSessionGroupEvent.css'

interface Props {
  event: HistoryTimelineEditSessionGroupEvent
  isFirst: boolean
  isLast: boolean
  now: number
  onOpenRevision: (rev: string) => void
  selectedRev?: string
}

export function EditSessionGroupEvent({
  event,
  isFirst,
  isLast,
  now,
  onOpenRevision,
  selectedRev
}: Props) {
  const isSelected = event.rev === selectedRev

  const handleHeaderClick = () => {
    onOpenRevision(event.rev)
  }

  return (
    <div
      className={classNames(
        isSelected ? styles.isSelected : styles.root,
        isFirst && styles.isFirst,
        isLast && styles.isLast
      )}
    >
      <button onClick={handleHeaderClick} type="button">
        <div className={styles.iconContainer}>
          <EditIcon />
        </div>
        <div className={styles.heading}>Edited</div>
        <div className={styles.dateline}>{formatDate(now, event.timestamp)}</div>
      </button>

      <div className={styles.content}>
        <EditSessionList sessions={event.sessions} />
      </div>
    </div>
  )
}
