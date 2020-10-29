import getIt from 'get-it'
import jsonRequest from 'get-it/lib/middleware/jsonRequest'
import jsonResponse from 'get-it/lib/middleware/jsonResponse'
import httpErrors from 'get-it/lib/middleware/httpErrors'
import {Observable} from 'rxjs'

const requester = getIt([observable(), httpErrors(), jsonRequest(), jsonResponse()])

export function request<T = unknown>(options: RequestOptions): Observable<T> {
  return requester(options)
}

export function apiRequest<T = unknown>(options: RequestOptions): Observable<T> {
  return requester({withCredentials: true, ...options})
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'PATCH'

export interface RequestOptions {
  url: string
  method?: RequestMethod
  headers?: Record<string, unknown>
  body?: string | ArrayBufferView | Blob | FormData | File
  bodySize?: number
  timeout?: {connect: number; socket: number}
  maxRedirects?: number
  rawBody?: boolean
  withCredentials?: boolean
}

export interface Response {
  body: string
  url: string
  method: RequestMethod
  statusCode: number
  statusMessage?: string
  headers: Record<string, string>
}

// Observable middleware without progress events
function observable() {
  return {
    onReturn: (channels, context) =>
      new Observable(observer => {
        channels.error.subscribe(err => observer.error(err))
        channels.response.subscribe(response => {
          observer.next(response.body)
          observer.complete()
        })

        channels.request.publish(context)
        return () => channels.abort.publish()
      })
  }
}
