import {createContext} from 'react'
import {PathsManager} from './types'

export interface PathsContextInstance {
  pathsManager: PathsManager
}

export const PathsContext = createContext<PathsContextInstance>({
  get pathsManager(): PathsManager {
    throw new Error('Context not initialized')
  }
})
