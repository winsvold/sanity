import {Observable, from} from 'rxjs'
import {map, switchMap} from 'rxjs/operators'
import {TransactionLogEvent} from './types'

type StreamResult = TransactionLogEvent | {error: {description?: string; type: string}}

export function getJsonStream(url: string): Observable<TransactionLogEvent> {
  const options: RequestInit = {credentials: 'include'}
  return from(fetch(url, options)).pipe(
    map(response => getStream(response)),
    switchMap(stream => streamToObservable(stream))
  )
}

function streamToObservable(stream: ReadableStream<StreamResult>): Observable<TransactionLogEvent> {
  const reader = stream.getReader()
  return new Observable<TransactionLogEvent>(subscriber => {
    function read(result: ReadableStreamReadResult<StreamResult>): void {
      if (result.done) {
        subscriber.complete()
        return
      }

      if ('error' in result.value) {
        subscriber.error(new Error(result.value.error.description || result.value.error.type))
        reader.cancel()
        return
      }

      subscriber.next(result.value)
      reader
        .read()
        .then(read)
        .catch(err => subscriber.error(err))
    }

    reader
      .read()
      .then(read)
      .catch(err => subscriber.error(err))

    return (): Promise<void> => reader.cancel()
  })
}

function getStream(response: Response): ReadableStream<StreamResult> {
  const body = response.body
  if (!body) {
    throw new Error('Failed to read body from response')
  }

  let reader
  let cancelled = false

  return new ReadableStream<TransactionLogEvent>({
    start(controller): void | PromiseLike<void> {
      reader = body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      reader
        .read()
        .then(function processResult(result) {
          if (result.done) {
            if (cancelled) {
              return
            }

            buffer = buffer.trim()
            if (buffer.length === 0) {
              controller.close()
              return
            }

            controller.enqueue(JSON.parse(buffer))
            controller.close()
            return
          }

          buffer += decoder.decode(result.value, {stream: true})
          const lines = buffer.split('\n')

          for (let i = 0; i < lines.length - 1; ++i) {
            const line = lines[i].trim()
            if (line.length === 0) {
              continue
            }

            try {
              controller.enqueue(JSON.parse(line))
            } catch (err) {
              controller.error(err)
              cancelled = true
              reader.cancel()
              return
            }
          }

          buffer = lines[lines.length - 1]

          // eslint-disable-next-line consistent-return
          return reader
            .read()
            .then(processResult)
            .catch(err => controller.error(err))
        })
        .catch(err => controller.error(err))
    },

    cancel(): void {
      cancelled = true
      reader.cancel()
    }
  })
}
