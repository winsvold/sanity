import {useContext, useMemo} from 'react'
import SanityClient, {SanityClient as SanityClientInstance} from '@sanity/client'
import {ProjectContext} from '../project/ProjectContext'

export function useClient(): SanityClientInstance {
  const {projectId, dataset, apiHost} = useContext(ProjectContext)
  return useMemo(() => new SanityClient({projectId, dataset, apiHost, useCdn: false}), [
    projectId,
    dataset,
    apiHost
  ])
}
