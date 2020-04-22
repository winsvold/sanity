/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-no-bind */

import * as React from 'react'
import HistoryTimelineItem from './HistoryTimelineItem'
import {HistoryEventType} from './types'

interface Props {
  events: HistoryEventType[]
  onItemSelect: (historyEvent: HistoryEventType) => void
  onSelectNext: () => void
  onSelectPrev: () => void
  selectedEvent: HistoryEventType
}

const HistoryTimeline = React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => {
  const {events, onItemSelect, onSelectNext, onSelectPrev, selectedEvent} = props

  return (
    <div ref={ref}>
      {events.map((event, i) => (
        <HistoryTimelineItem
          {...event}
          key={event.rev}
          isSelected={event === selectedEvent}
          isCurrentVersion={i === 0}
          onClick={() => onItemSelect(event)}
          onSelectNext={onSelectNext}
          onSelectPrev={onSelectPrev}
        />
      ))}
    </div>
  )
})

HistoryTimeline.displayName = 'HistoryTimeline'

export default HistoryTimeline
