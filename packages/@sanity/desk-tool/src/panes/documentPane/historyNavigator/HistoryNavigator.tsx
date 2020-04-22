/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react'
import {HistoryTimeline} from './timeline/HistoryTimeline'
import {HistoryTimelineEvent} from './types'

import styles from './HistoryNavigator.css'

interface Props {
  currentRev?: string
  events: HistoryTimelineEvent[]
  onOpenRevision: (rev: string) => void
}

export function HistoryNavigator(props: Props) {
  const {currentRev, events, onOpenRevision} = props
  const [now, setNow] = React.useState(Date.now())

  React.useEffect(() => {
    const nowIntervalId = setInterval(() => setNow(Date.now()), 10000)
    return () => clearInterval(nowIntervalId)
  }, [])

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.title}>History</div>
      </header>

      <div className={styles.timelineContainer}>
        <HistoryTimeline
          events={events}
          now={now}
          onOpenRevision={onOpenRevision}
          selectedRev={currentRev}
        />
      </div>
    </div>
  )
}
