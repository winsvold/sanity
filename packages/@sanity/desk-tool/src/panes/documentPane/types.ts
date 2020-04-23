import {HistoryEventType} from './historyNavigator/__legacy'

export interface Doc {
  _id: string
  _type: string
  _rev: string
  _updatedAt: string
}

export interface HistoricalDocumentState {
  isLoading: boolean
  snapshot: null | Doc
  prevSnapshot: null | Doc
}

export interface HistoryState {
  isLoading: boolean
  isLoaded: boolean
  error: null | Error
  events: HistoryEventType[]
}
