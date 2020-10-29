import {LoadableState, useLoadable} from '../util/useLoadable'
import {request, RequestOptions, Response} from './controller'

export function useRequest(options: RequestOptions): LoadableState<Response> {
  return useLoadable(request(options))
}
