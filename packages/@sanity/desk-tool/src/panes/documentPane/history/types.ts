import {Doc} from '../types'

export interface HistoryRevisionState {
  isLoading: boolean
  snapshot: Doc | null
  prevSnapshot: Doc | null
}

export interface HistoryEventsState {
  isLoading: boolean
  isLoaded: boolean
  error: null | Error
  events: HistoryTimelineEvent[]
}

export type RevisionRange = string[] | string | null

export interface HistorySelectionRange {
  from: {rev: string | null; index: number; event: HistoryTimelineEvent | null}
  to: {rev: string | null; index: number; event: HistoryTimelineEvent | null}
}

// TODO: remove this
export interface LegacyHistoryEventType {
  startTime: string
  endTime: string
  displayDocumentId: string
  documentIds: string[]
  rev: string
  transactionIds: string[]
  type:
    | 'created'
    | 'deleted'
    | 'edited'
    | 'published'
    | 'unpublished'
    | 'truncated'
    | 'discardDraft'
    | 'unknown'
  userIds: string[]
}

export interface EditSession {
  type: 'editSession'
  edits: string[]
  length: number
  offset: number
}

export interface HistoryTimelineCreateEvent {
  type: 'create'
  displayDocumentId: string
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineDeleteEvent {
  type: 'delete'
  displayDocumentId: string
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineDiscardDraftEvent {
  type: 'discardDraft'
  displayDocumentId: string
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineEditSessionGroupEvent {
  type: 'editSessionGroup'
  displayDocumentId: string
  sessions: Array<EditSession>
  timestamp: number
  userIds: string[]
  offset: number
  length: number
  rev: string
}

export interface HistoryTimelinePublishEvent {
  type: 'publish'
  displayDocumentId: string
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineTruncateEvent {
  type: 'truncate'
  displayDocumentId: string
  timestamp: number
  userIds: string[]
  offset: number
  rev: string
}

export interface HistoryTimelineUnpublishEvent {
  type: 'unpublish'
  displayDocumentId: string
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineUnknownEvent {
  type: 'unknown'
  displayDocumentId: string
  timestamp: number
  message: string
  rev: string
}

export type HistoryTimelineEvent =
  | HistoryTimelineCreateEvent
  | HistoryTimelineDeleteEvent
  | HistoryTimelineDiscardDraftEvent
  | HistoryTimelineEditSessionGroupEvent
  | HistoryTimelinePublishEvent
  | HistoryTimelineTruncateEvent
  | HistoryTimelineUnpublishEvent
  | HistoryTimelineUnknownEvent
