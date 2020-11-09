import {Placement, Popover, useClickOutside} from '@sanity/ui'
import {Chunk} from '@sanity/field/diff'
import React, {useCallback, useState} from 'react'
import {useDocumentHistory} from '../documentHistory'
import {sinceTimelineProps, revTimelineProps} from './helpers'
import {Timeline} from './timeline'

interface TimelinePopoverProps {
  onClose: () => void
  open: boolean
  placement: Placement
  targetElement: HTMLDivElement | null
}

export function TimelinePopover(props: TimelinePopoverProps) {
  const {onClose, open, targetElement} = props
  const [timelineElement, setTimelineElement] = useState<HTMLElement | null>(null)

  const {
    historyController,
    setRange,
    setTimelineMode,
    timeline,
    timelineMode
  } = useDocumentHistory()

  const selectRev = useCallback(
    (revChunk: Chunk) => {
      const [sinceId, revId] = historyController.findRangeForNewRev(revChunk)
      setTimelineMode('closed')
      setRange(sinceId, revId)
    },
    [historyController, setRange, setTimelineMode]
  )

  const selectSince = useCallback(
    (sinceChunk: Chunk) => {
      const [sinceId, revId] = historyController.findRangeForNewSince(sinceChunk)
      setTimelineMode('closed')
      setRange(sinceId, revId)
    },
    [historyController, setRange, setTimelineMode]
  )

  const loadMoreHistory = useCallback(
    (state: boolean) => {
      historyController.setLoadMore(state)
    },
    [historyController]
  )

  useClickOutside(onClose, [timelineElement])

  const content = (
    <>
      {timelineMode === 'rev' && (
        <Timeline
          ref={setTimelineElement}
          timeline={timeline}
          onSelect={selectRev}
          onLoadMore={loadMoreHistory}
          {...revTimelineProps(historyController.realRevChunk)}
        />
      )}

      {timelineMode !== 'rev' && (
        <Timeline
          ref={setTimelineElement}
          timeline={timeline}
          onSelect={selectSince}
          onLoadMore={loadMoreHistory}
          {...sinceTimelineProps(historyController.sinceTime!, historyController.realRevChunk)}
        />
      )}
    </>
  )

  // @todo
  // // Set `transition` after visible mount
  // useEffect(() => {
  //   if (!openRef.current) {
  //     setMounted(false)

  //     requestAnimationFrame(() => {
  //       requestAnimationFrame(() => {
  //         setMounted(true)
  //       })
  //     })
  //   }

  //   openRef.current = open
  // }, [open])

  return (
    <Popover
      // className={classNames(styles.root, mounted && styles.mounted)}
      content={content}
      open={open}
      referenceElement={targetElement}
    />
  )
}
