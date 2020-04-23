/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-multi-comp */

import QuestionIcon from 'part:@sanity/base/question-icon'
import PlusIcon from 'part:@sanity/base/plus-icon'
import PublishIcon from 'part:@sanity/base/publish-icon'
import UnpublishIcon from 'part:@sanity/base/unpublish-icon'
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
  isFirst,
  isLast,
  now,
  onOpenRevision,
  selectedRev
}: {
  event: HistoryTimelineEvent
  isFirst: boolean
  isLast: boolean
  now: number
  onOpenRevision: (rev: string) => void
  selectedRev?: string
}) {
  if (event.type === 'create') {
    return (
      <GenericEvent
        icon={<PlusIcon />}
        isFirst={isFirst}
        isLast={isLast}
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
        isFirst={isFirst}
        isLast={isLast}
        now={now}
        onOpenRevision={onOpenRevision}
        selectedRev={selectedRev}
      />
    )
  }

  if (event.type === 'publish') {
    return (
      <GenericEvent
        icon={<PublishIcon />}
        isFirst={isFirst}
        isLast={isLast}
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
        icon={<UnpublishIcon />}
        isFirst={isFirst}
        isLast={isLast}
        isSelected={event.rev === selectedRev}
        now={now}
        onClick={() => onOpenRevision(event.rev)}
        timestamp={event.timestamp}
        title="Unpublished"
      />
    )
  }

  return (
    <GenericEvent
      icon={<QuestionIcon />}
      isFirst={isFirst}
      isLast={isLast}
      isSelected={(event as any).rev === selectedRev}
      now={now}
      onClick={() => onOpenRevision((event as any).rev)}
      title={`Unknown event type: ${(event as any).type}`}
    />
  )
}

export function HistoryTimeline(props: Props) {
  // console.log('HistoryTimeline', props)

  const len = props.events.length

  return (
    <div className={styles.root}>
      {props.events.map((event, idx) => (
        <HistoryTimelineEventResolver
          event={event}
          isFirst={idx === 0}
          isLast={idx === len - 1}
          key={idx}
          now={props.now}
          onOpenRevision={props.onOpenRevision}
          selectedRev={props.selectedRev}
        />
      ))}
    </div>
  )
}
