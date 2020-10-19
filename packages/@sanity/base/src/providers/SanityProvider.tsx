import React from 'react'
import {ProjectContext} from '../project/ProjectContext'

interface SanityProps {
  dataset: string
  projectId: string
  children: React.ReactNode
  displayName?: string
  apiHost?: string
}

export function SanityProvider(props: SanityProps) {
  const {projectId, dataset, displayName, apiHost, children} = props
  return (
    <ProjectContext.Provider value={{projectId, dataset, displayName, apiHost}}>
      {children}
    </ProjectContext.Provider>
  )
}
