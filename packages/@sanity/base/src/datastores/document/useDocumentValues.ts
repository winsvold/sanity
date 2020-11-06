import {of} from 'rxjs'
import {observePaths} from '@sanity/preview'
import {useMemo} from 'react'
import {LoadableState, useLoadable} from '../../util/useLoadable'

export function useDocumentValues<T = Record<string, unknown>>(
  documentId: string | undefined,
  paths: string[]
): LoadableState<T> {
  const documentValues$ = useMemo(
    () => (documentId ? observePaths(documentId, paths) : of(undefined)),
    [documentId, ...paths]
  )

  return useLoadable(documentValues$)
}
