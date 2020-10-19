import {createContext} from 'react'

/**
 * @alpha
 */
export interface ProjectContextInstance {
  apiHost?: string
  projectId: string
  dataset: string
  displayName: string
}

/**
 * @alpha
 */
export const ProjectContext = createContext<ProjectContextInstance>({
  get projectId(): string {
    throw new Error('Project ID not provided')
  },

  get dataset(): string {
    throw new Error('Dataset not provided')
  },

  displayName: 'Sanity'
})
