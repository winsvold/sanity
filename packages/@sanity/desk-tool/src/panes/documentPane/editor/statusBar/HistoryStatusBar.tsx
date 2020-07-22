/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react'
import styles from './DocumentStatusBar.css'
import {HistoryStatusBarActions} from './DocumentStatusBarActions'
import TimeAgo from '../../../../components/TimeAgo'

interface Props {
  id: string
  type: string
}

export function HistoryStatusBar(props: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.status}>
        <div className={styles.statusDetails}>
          Changed <TimeAgo time={100} />
          (latest)
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.actionsWrapper}>
          <HistoryStatusBarActions
            id={props.id}
            type={props.type}
            revision={"TODO"}
          />
        </div>
      </div>
    </div>
  )
}
