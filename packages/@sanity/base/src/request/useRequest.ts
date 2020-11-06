import {useMemo} from 'react'
import {LoadableState, useLoadable} from '../util/useLoadable'
import {request, RequestOptions, Response} from './controller'

export function useRequest(options: RequestOptions): LoadableState<Response> {
  const response$ = useMemo(() => request<Response>(options), [options])

  return useLoadable(response$)
}
