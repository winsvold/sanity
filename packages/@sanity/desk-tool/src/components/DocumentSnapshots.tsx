import {streamingComponent} from 'react-props-stream'
import {map, switchMap, scan, filter} from 'rxjs/operators'
import {merge, Observable} from 'rxjs'
import {observePaths} from 'part:@sanity/base/preview'
import {getDraftId, getPublishedId} from 'part:@sanity/base/util/draft-utils'

interface DocumentSnapshotsProps {
  id: string
  paths?: string[]
  children: (value?: Record<string, any>) => React.ReactNode
}

const DocumentSnapshots = streamingComponent<DocumentSnapshotsProps>(props$ => {
  return props$.pipe(
    switchMap(props => {
      const tmp1$: Observable<Record<string, any>> = observePaths(
        getDraftId(props.id),
        props.paths as any
      ).pipe(map(draft => ({draft})))

      const tmp2$: Observable<Record<string, any>> = observePaths(
        getPublishedId(props.id),
        props.paths as any
      ).pipe(map(published => ({published})))

      return merge(tmp1$, tmp2$).pipe(
        scan((prev: Record<string, any>, res) => ({...prev, ...res}), {}),
        filter(res => 'draft' in res && 'published' in res),
        map(res => props.children(res))
      )
    })
  )
})

export default DocumentSnapshots
