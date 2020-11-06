import {Project} from '@sanity/types'
import {useMemo} from 'react'
import {LoadableState, useLoadable} from '../util/useLoadable'
import {getProjects} from './controller'

export function useProjects(): LoadableState<Project[]> {
  const projects$ = useMemo(() => getProjects(), [])

  return useLoadable(projects$)
}
