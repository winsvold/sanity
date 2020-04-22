/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {format, isToday, isYesterday} from 'date-fns'

const DATE_FORMAT = 'MMM D, YYYY, hh:mm A'

export function getHistoryEventDateString(event: any) {
  if (isToday(event.endTime)) {
    return `Today, ${format(event.endTime, 'hh:mm A')}`
  }

  if (isYesterday(event.endTime)) {
    return `Yesterday, ${format(event.endTime, 'hh:mm A')}`
  }

  return format(event.endTime, DATE_FORMAT)
}
