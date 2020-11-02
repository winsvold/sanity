import {useContext} from 'react'
import {ProjectContext} from './ProjectContext'

interface ProjectInfo {
  id: string
  displayName: string
}

export function useProjectInfo(): ProjectInfo {
  const {projectId, displayName} = useContext(ProjectContext)
  return {id: projectId, displayName}
}
