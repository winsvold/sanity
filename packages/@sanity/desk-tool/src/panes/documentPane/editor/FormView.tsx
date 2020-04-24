/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react'
import {Subscription} from 'rxjs'
import {isActionEnabled} from 'part:@sanity/base/util/document-action-utils'
import Button from 'part:@sanity/components/buttons/default'
import schema from 'part:@sanity/base/schema'
import afterEditorComponents from 'all:part:@sanity/desk-tool/after-editor-component'
import filterFieldFn$ from 'part:@sanity/desk-tool/filter-fields-fn?'
import EditForm from './EditForm'
import HistoryForm from './HistoryForm'
import {Doc} from '../types'

import styles from './FormView.css'

interface Props {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patchChannel?: any
  document: {
    draft: Doc | null
    published: Doc | null
    revision: Doc | null
    displayed: Doc | null
  }
  initialValue: Doc
  isConnected: boolean
  isHistoryOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (patches: any[]) => void
  schemaType: {name: string; title: string}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markers: Array<{path: any[]}>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedHistoryEvent: any
  selectedHistoryEventIsLatest: boolean
}

const noop = () => undefined

const INITIAL_STATE = {
  focusPath: [],
  filterField: () => true
}

export default class FormView extends React.PureComponent<Props> {
  static defaultProps = {
    markers: [],
    isConnected: true
  }

  state = INITIAL_STATE

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterFieldFnSubscription: Subscription | null = null

  componentDidMount() {
    if (filterFieldFn$) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.filterFieldFnSubscription = filterFieldFn$.subscribe((filterField: any) =>
        this.setState({filterField})
      )
    }
  }

  componentWillUnmount() {
    if (this.filterFieldFnSubscription) {
      this.filterFieldFnSubscription.unsubscribe()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFocus = (path: any[]) => {
    this.setState({focusPath: path})
  }

  handleBlur = () => {
    // do nothing
  }

  handleEditAsActualType = () => {
    // TODO
  }

  isReadOnly() {
    const {document, schemaType, isConnected} = this.props
    const {draft, published} = document
    const isNonExistent = !draft && !published

    return (
      !isConnected ||
      !isActionEnabled(schemaType, 'update') ||
      (isNonExistent && !isActionEnabled(schemaType, 'create'))
    )
  }

  render() {
    const {
      document,
      id,
      initialValue,
      isHistoryOpen,
      markers,
      patchChannel,
      schemaType,
      selectedHistoryEventIsLatest
    } = this.props
    const {draft, published, displayed} = document
    const {focusPath, filterField} = this.state
    const value = draft || published || ({} as Doc)
    const readOnly = this.isReadOnly()
    const documentId = displayed && displayed._id && displayed._id.replace(/^drafts\./, '')

    const hasTypeMismatch = value && value._type && value._type !== schemaType.name
    if (hasTypeMismatch) {
      return (
        <div className={styles.typeMisMatchMessage}>
          This document is of type <code>{value._type}</code> and cannot be edited as{' '}
          <code>{schemaType.name}</code>
          <div>
            <Button onClick={this.handleEditAsActualType}>Edit as {value._type} instead</Button>
          </div>
        </div>
      )
    }

    // console.log({isHistoryOpen, selectedHistoryEventIsLatest})

    const showHistoricDocument = isHistoryOpen && !selectedHistoryEventIsLatest

    return (
      <div className={styles.root}>
        {showHistoricDocument ? (
          <HistoryForm document={displayed} schema={schema} schemaType={schemaType} />
        ) : (
          <EditForm
            id={id}
            value={draft || published || initialValue}
            filterField={filterField}
            focusPath={focusPath}
            markers={markers}
            onBlur={this.handleBlur}
            onChange={readOnly ? noop : this.props.onChange}
            onFocus={this.handleFocus}
            patchChannel={patchChannel}
            readOnly={readOnly}
            schema={schema}
            type={schemaType}
          />
        )}

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {afterEditorComponents.map((AfterEditorComponent: any, idx: number) => (
          <AfterEditorComponent key={String(idx)} documentId={documentId} />
        ))}
      </div>
    )
  }
}
