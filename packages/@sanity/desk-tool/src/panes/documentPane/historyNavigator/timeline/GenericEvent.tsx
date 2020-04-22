/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react'
import {formatDate} from '../format'

import styles from './GenericEvent.css'

interface Props {
  isSelected: boolean
  now: number
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  timestamp?: number
  title: string
}

export function GenericEvent({isSelected, now, onClick, timestamp, title}: Props) {
  return (
    <button
      className={isSelected ? styles.isSelected : styles.root}
      onClick={onClick}
      type="button"
    >
      <div className={styles.iconContainer} />
      <div className={styles.heading}>{title}</div>
      {timestamp && <div className={styles.dateline}>{formatDate(now, timestamp)}</div>}
    </button>
  )
}
