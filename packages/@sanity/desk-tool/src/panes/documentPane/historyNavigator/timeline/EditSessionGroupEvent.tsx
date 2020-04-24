/* eslint-disable @typescript-eslint/explicit-function-return-type */

import classNames from 'classnames'
import EditIcon from 'part:@sanity/base/edit-icon'
import * as React from 'react'
import {RevisionRange} from '../../types'
import {formatDate} from '../format'
import {HistoryTimelineEditSessionGroupEvent} from '../types'
// import {getIsSelected} from './helpers'
import EditSessionList from './EditSessionList'

import styles from './EditSessionGroupEvent.css'

interface Props {
  event: HistoryTimelineEditSessionGroupEvent
  isFirst: boolean
  isLast: boolean
  isSelected: boolean
  now: number
  // onSelect: (rev: string) => void
  onSelect: (selection: RevisionRange) => void
  selection: RevisionRange
}

export function EditSessionGroupEvent(props: Props) {
  const {event, isFirst, isLast, isSelected, now, onSelect, selection} = props
  // const _isSelected = getIsSelected(selection, isFirst ? '-' : event.rev)

  const handleHeaderClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (ev.shiftKey && selection) {
      const fromRev = Array.isArray(selection) ? selection[0] : selection
      const toRev = isFirst ? '-' : event.rev

      return onSelect([fromRev, toRev])
    }

    onSelect(isFirst ? '-' : event.rev)
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
        <EditSessionList isSelected={isSelected} sessions={event.sessions} />
      </div>
    </div>
  )
}
