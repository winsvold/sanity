import {Project} from '@sanity/types'
import {Observable} from 'rxjs'
import {apiRequest} from '../request'

export function getProjects(): Observable<Project[]> {
  return apiRequest<Project[]>({url: 'https://api.sanity.io/v1/projects'})
}
