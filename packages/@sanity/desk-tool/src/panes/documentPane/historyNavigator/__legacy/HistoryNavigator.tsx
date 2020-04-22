/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react'
import scroll from 'scroll'
import Snackbar from 'part:@sanity/components/snackbar/default'
import Spinner from 'part:@sanity/components/loading/spinner'
import HistoryTimeline from './HistoryTimeline'
import {HistoryEventType} from './types'

import styles from './HistoryNavigator.css'

export interface HistoryNavigatorProps {
  events: HistoryEventType[]
  documentId: string
  onItemSelect: (historyEvent: HistoryEventType) => void
  isLoading: boolean
  selectedEvent?: HistoryEventType
  error: Error | null
}

export default class HistoryNavigator extends React.PureComponent<HistoryNavigatorProps> {
  static defaultProps = {
    isLoading: true
  }

  _timelineContainerElement: React.RefObject<HTMLDivElement> = React.createRef()
  _timelineElement: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidMount() {
    this.handleScrollToSelected()
  }

  componentDidUpdate(prevProps: HistoryNavigatorProps) {
    const {isLoading} = this.props

    if (prevProps.isLoading && !isLoading) {
      this.handleScrollToSelected()
    }
  }

  handleNewCurrentEvent = () => {
    if (this._timelineContainerElement && this._timelineContainerElement.current) {
      scroll.top(this._timelineContainerElement.current, 0)
    }
  }

  handleScrollToSelected = () => {
    const {events, selectedEvent} = this.props

    if (!selectedEvent) return

    const selectedIndex = events.indexOf(selectedEvent)

    const timelineContainerElement = this._timelineContainerElement.current
    const timelinelement = this._timelineElement.current

    if (selectedIndex > 0 && timelineContainerElement && timelinelement) {
      const listElement = timelinelement.childNodes[selectedIndex] as HTMLElement

      if (listElement) {
        const listElementRect = listElement.getBoundingClientRect()
        // Leave a bit of room at the top if possible, to indicate that we've scrolled
        const scrollTo = Math.max(0, listElementRect.top - 250)
        scroll.top(timelineContainerElement, scrollTo)
      }
    }
  }

  handleSelectNext = () => {
    const {events, selectedEvent, onItemSelect} = this.props

    if (!selectedEvent) return

    const i = events.indexOf(selectedEvent)
    const newSelection = i === -1 ? null : events[i + 1]
    if (newSelection) {
      onItemSelect(newSelection)
    }
  }

  handleSelectPrev = () => {
    const {events, selectedEvent, onItemSelect} = this.props

    if (!selectedEvent) return

    const i = events.indexOf(selectedEvent)
    const newSelection = i === -1 ? null : events[i - 1]
    if (newSelection) {
      onItemSelect(newSelection)
    }
  }

  render() {
    const {events, onItemSelect, selectedEvent, isLoading, error} = this.props

    return (
      <div className={styles.root}>
        <header className={styles.header}>
          <div className={styles.title}>History</div>
        </header>

        {isLoading && <Spinner center message="Loading history" />}

        {error && <p>Could not load history</p>}

        <div className={styles.timelineContainer} ref={this._timelineContainerElement}>
          {!(isLoading || error) && (
            <HistoryTimeline
              events={events}
              onItemSelect={onItemSelect}
              onSelectPrev={this.handleSelectPrev}
              onSelectNext={this.handleSelectNext}
              ref={this._timelineElement}
              selectedEvent={selectedEvent}
            />
          )}
        </div>

        {error && <Snackbar kind="error" isPersisted title={error.message} />}
      </div>
    )
  }
}
