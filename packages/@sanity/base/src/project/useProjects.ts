import {Project} from '@sanity/types/lib'
import {LoadableState, useLoadable} from '../util/useLoadable'
import {getProjects} from './controller'

export function useProjects(): LoadableState<Project[]> {
  return useLoadable(getProjects())
}
