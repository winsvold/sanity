/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react'
import TimeAgo from '../../../../components/TimeAgo'
import {useDocumentHistory} from '../../documentHistory'
import styles from './documentStatusBar.css'
import {DocumentStatusBarActions} from './documentStatusBarActions'
import {DocumentSparkline} from './documentSparkline'
// import {SyncState} from './syncState'

interface Props {
  id: string
  type: string
  lastUpdated?: string
}

export function DocumentStatusBar(props: Props) {
  const {open: openHistory, historyController, timeline} = useDocumentHistory()
  return (
    <div className={styles.root}>
      <div className={styles.status} data-historyState={historyController.selectionState}>
        <button
          className={styles.lastUpdatedButton}
          onClick={openHistory}
          type="button"
          disabled={historyController.selectionState === 'active'}
        >
          {/* <div className={styles.statusBadgesContainer}>
            <DocumentStatusBarBadges id={props.id} type={props.type} />
          </div> */}
          <div className={styles.sparklineContainer}>
            <DocumentSparkline
              timeline={timeline}
              disabled={historyController.selectionState === 'active'}
            />
          </div>
          <div className={styles.statusDetails}>
            {/* TODO */}
            <div className={styles.lastStatus}>Status</div>
            {props.lastUpdated ? (
              <div>
                <TimeAgo time={props.lastUpdated} />
              </div>
            ) : (
              'Empty'
            )}
          </div>
        </button>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsWrapper}>
          <DocumentStatusBarActions id={props.id} type={props.type} />
        </div>
      </div>
    </div>
  )
}
