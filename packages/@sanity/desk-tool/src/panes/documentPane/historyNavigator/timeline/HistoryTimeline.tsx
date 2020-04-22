/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-multi-comp */

import * as React from 'react'
import {HistoryTimelineEvent} from '../types'
import {EditSessionGroupEvent} from './EditSessionGroupEvent'
import {GenericEvent} from './GenericEvent'

import styles from './HistoryTimeline.css'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  events: HistoryTimelineEvent[]
  now: number
  onOpenRevision: (rev: string) => void
  selectedRev?: string
}

function HistoryTimelineEventResolver({
  event,
  now,
  onOpenRevision,
  selectedRev
}: {
  event: HistoryTimelineEvent
  now: number
  onOpenRevision: (rev: string) => void
  selectedRev?: string
}) {
  if (event.type === 'create') {
    return (
      <GenericEvent
        isSelected={event.rev === selectedRev}
        now={now}
        onClick={() => onOpenRevision(event.rev)}
        timestamp={event.timestamp}
        title="Created"
      />
    )
  }

  if (event.type === 'editSessionGroup') {
    return (
      <EditSessionGroupEvent
        event={event}
        now={now}
        onOpenRevision={onOpenRevision}
        selectedRev={selectedRev}
      />
    )
  }

  if (event.type === 'publish') {
    return (
      <GenericEvent
        isSelected={event.rev === selectedRev}
        now={now}
        onClick={() => onOpenRevision(event.rev)}
        timestamp={event.timestamp}
        title="Published"
      />
    )
  }

  if (event.type === 'unpublish') {
    return (
      <GenericEvent
        isSelected={event.rev === selectedRev}
        now={now}
        onClick={() => onOpenRevision(event.rev)}
        timestamp={event.timestamp}
        title="Unpublished"
      />
    )
  }

  if (event.type === 'unknown') {
    return (
      <GenericEvent
        isSelected={event.rev === selectedRev}
        now={now}
        onClick={() => onOpenRevision(event.rev)}
        title={event.message}
      />
    )
  }

  return (
    <GenericEvent
      isSelected={(event as any).rev === selectedRev}
      now={now}
      onClick={() => onOpenRevision((event as any).rev)}
      title={`Unknown event type: ${(event as any).type}`}
    />
  )
}

export function HistoryTimeline(props: Props) {
  // console.log('HistoryTimeline', props)

  return (
    <div className={styles.root}>
      {props.events.map((event, idx) => (
        <HistoryTimelineEventResolver
          event={event}
          key={idx}
          now={props.now}
          onOpenRevision={props.onOpenRevision}
          selectedRev={props.selectedRev}
        />
      ))}
    </div>
  )
}
