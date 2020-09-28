import {createScope, Reported} from '../components/react-track-elements'
import {Path} from '@sanity/types'
import {ENABLED} from './constants'
import {createNoopTracker} from './noop-tracker'

export interface TrackedChange {
  element: HTMLElement
  path: Path
  isChanged: boolean
  hasFocus: boolean
  hasHover: boolean
  hasRevertHover: boolean
}

export interface TrackedArea {
  element: HTMLElement
}

const {Tracker, useReportedValues, useReporter} = ENABLED
  ? createScope<TrackedChange | TrackedArea>()
  : createNoopTracker<TrackedChange | TrackedArea>()

export {Tracker, useReportedValues, useReporter, Reported}