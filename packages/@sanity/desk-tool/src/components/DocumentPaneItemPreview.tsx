import React from 'react'
import {combineLatest, concat, Observable, of, Subscription} from 'rxjs'
import {assignWith} from 'lodash'
import {map} from 'rxjs/operators'
import {getDraftId, getPublishedId} from 'part:@sanity/base/util/draft-utils'
import WarningIcon from 'part:@sanity/base/warning-icon'
import {observeForPreview, SanityDefaultPreview} from 'part:@sanity/base/preview'
import {PreviewValue, ResolvedSchema} from '../types'
import NotPublishedStatus from './NotPublishedStatus'
import DraftStatus from './DraftStatus'

const isLiveEditEnabled = (schemaType: {liveEdit?: boolean}) => schemaType.liveEdit === true

const getStatusIndicator = (draft?: unknown, published?: unknown) => {
  if (draft) {
    return DraftStatus
  }

  return published ? null : NotPublishedStatus
}

const getMissingDocumentFallback = (item: PreviewValue) => ({
  title: <span style={{fontStyle: 'italic'}}>{item.title || 'Missing document'}</span>,
  subtitle: (
    <span style={{fontStyle: 'italic'}}>
      {item.title ? `Missing document ID: ${item._id}` : `Document ID: ${item._id}`}
    </span>
  ),
  media: WarningIcon
})

const getValueWithFallback = ({
  value,
  draft,
  published
}: {
  value: PreviewValue
  draft: unknown
  published: unknown
}) => {
  const snapshot = draft || published
  if (!snapshot) {
    return getMissingDocumentFallback(value)
  }

  return assignWith({}, snapshot, value, (objValue, srcValue) => {
    return typeof srcValue === 'undefined' ? objValue : srcValue
  })
}

interface DocumentPaneItemPreviewProps {
  layout?: 'default' | 'card' | 'media' | 'detail' | 'inline' | 'block'
  icon?: React.ComponentType | boolean
  value: PreviewValue
  schemaType: ResolvedSchema
}

interface State {
  draft?: Record<string, any> | null
  published?: Record<string, any> | null
  isLoading: boolean
}

export default class DocumentPaneItemPreview extends React.Component<
  DocumentPaneItemPreviewProps,
  State
> {
  state: State = {isLoading: false}

  subscription?: Subscription

  constructor(props: DocumentPaneItemPreviewProps) {
    super(props)
    const {value, schemaType} = props
    const {title} = value
    let sync = true

    const initialState$ = of({isLoading: true})
    const draft$: Observable<{snapshot: Record<string, any> | null}> = isLiveEditEnabled(schemaType)
      ? of({snapshot: null})
      : observeForPreview({_id: getDraftId(value._id)}, schemaType as any)

    const published$: Observable<{snapshot: Record<string, any> | null}> = observeForPreview(
      {_id: getPublishedId(value._id)},
      schemaType as any
    )

    const latestState$ = combineLatest([draft$, published$]).pipe(
      map(([draft, published]) => ({
        draft: draft.snapshot ? {title, ...draft.snapshot} : null,
        published: published.snapshot ? {title, ...published.snapshot} : null,
        isLoading: false
      }))
    )

    const state$: Observable<State> = concat(initialState$, latestState$)

    this.subscription = state$.subscribe(state => {
      if (sync) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state = state
      } else {
        this.setState(state)
      }
    })
    sync = false
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  render() {
    const {value, schemaType, layout = 'default', icon} = this.props
    const {draft, published, isLoading} = this.state

    return (
      <SanityDefaultPreview
        value={getValueWithFallback({value, draft, published})}
        // isPlaceholder={isLoading}
        icon={icon}
        layout={layout}
        // type={schemaType}
        // status={isLoading ? null : getStatusIndicator(draft, published)}
      />
    )
  }
}
