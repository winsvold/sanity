import {HistoryTimelineEvent, LegacyHistoryEventType} from '../history'

export function mapLegacyEventsToEvents(
  legacyEvents: LegacyHistoryEventType[]
): HistoryTimelineEvent[] {
  const eventsIncludingUnknowns: Array<HistoryTimelineEvent> = legacyEvents.map(event => {
    if (event.type === 'created') {
      return {
        type: 'create',
        displayDocumentId: event.displayDocumentId,
        timestamp: Date.parse(event.endTime),
        userId: event.userIds[0],
        offset: 0,
        rev: event.rev
      }
    }

    if (event.type === 'edited') {
      return {
        type: 'editSessionGroup',
        displayDocumentId: event.displayDocumentId,
        sessions: [
          {
            type: 'editSession',
            edits: ['cf', 'cf', 'cf', 'cf', 'cf'],
            length: 5,
            offset: 1
          },
          {
            type: 'editSession',
            edits: ['cf', 'cf', 'cf', 'cf', 'cf', 'cf', 'cf'],
            length: 7,
            offset: 6
          },
          {
            type: 'editSession',
            edits: ['as', 'as', 'as', 'as', 'as'],
            length: 5,
            offset: 13
          },
          {
            type: 'editSession',
            edits: ['eh', 'eh'],
            length: 2,
            offset: 18
          }
        ],
        length: 19,
        offset: 1,
        timestamp: Date.parse(event.endTime),
        userIds: event.userIds,
        rev: event.rev
      }
    }

    if (event.type === 'deleted') {
      return {
        type: 'delete',
        displayDocumentId: event.displayDocumentId,
        timestamp: Date.parse(event.endTime),
        userId: event.userIds[0],
        offset: 0,
        rev: event.rev
      }
    }

    if (event.type === 'discardDraft') {
      return {
        type: 'discardDraft',
        displayDocumentId: event.displayDocumentId,
        timestamp: Date.parse(event.endTime),
        userId: event.userIds[0],
        offset: 0,
        rev: event.rev
      }
    }

    if (event.type === 'published') {
      return {
        type: 'publish',
        displayDocumentId: event.displayDocumentId,
        timestamp: Date.parse(event.endTime),
        userId: event.userIds[0],
        offset: 0,
        rev: event.rev
      }
    }

    if (event.type === 'unpublished') {
      return {
        type: 'unpublish',
        displayDocumentId: event.displayDocumentId,
        timestamp: Date.parse(event.endTime),
        userId: event.userIds[0],
        offset: 0,
        rev: event.rev
      }
    }

    if (event.type === 'truncated') {
      return {
        type: 'truncate',
        displayDocumentId: event.displayDocumentId,
        timestamp: Date.parse(event.endTime),
        userIds: event.userIds,
        offset: 0,
        rev: event.rev
      }
    }

    console.warn('unknown event', event)

    return {
      type: 'unknown',
      displayDocumentId: event.displayDocumentId,
      timestamp: Date.parse(event.endTime),
      message: `unknown type: ${event.type}`,
      rev: event.rev
    }
  })

  return eventsIncludingUnknowns.filter(e => e.type !== 'unknown') as HistoryTimelineEvent[]
}
