export interface HistoryEventType {
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
