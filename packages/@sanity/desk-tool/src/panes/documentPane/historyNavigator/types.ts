export interface HistoryTimelineCreateEvent {
  type: 'create'
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineEditSessionGroupEvent {
  type: 'editSessionGroup'
  sessions: Array<{
    type: 'editSession'
    edits: string[]
    length: number
    offset: number
  }>
  timestamp: number
  userIds: string[]
  offset: number
  length: number
  rev: string
}

export interface HistoryTimelinePublishEvent {
  type: 'publish'
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineUnpublishEvent {
  type: 'unpublish'
  timestamp: number
  userId: string
  offset: number
  rev: string
}

export interface HistoryTimelineUnknownEvent {
  type: 'unknown'
  message: string
  rev: string
}

export type HistoryTimelineEvent =
  | HistoryTimelineCreateEvent
  | HistoryTimelineEditSessionGroupEvent
  | HistoryTimelinePublishEvent
  | HistoryTimelineUnpublishEvent
