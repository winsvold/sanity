/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */

import React from 'react'
import {isActionEnabled} from 'part:@sanity/base/util/document-action-utils'
import Button from 'part:@sanity/components/buttons/default'
import schema from 'part:@sanity/base/schema'
import afterEditorComponents from 'all:part:@sanity/desk-tool/after-editor-component'
import filterFieldFn$ from 'part:@sanity/desk-tool/filter-fields-fn?'
import {CURRENT_REVISION_FLAG} from '../../../constants'
import EditForm from './EditForm'
import HistoryForm from './HistoryForm'
import {Doc} from '../types'

import styles from './FormView.css'

interface Props {
  id: string
  patchChannel?: any
  document: {
    draft: Doc | null // {_id: string; _type: string}
    published: Doc | null // {_id: string; _type: string}
    displayed: Doc | null // {_id: string; _type: string}
  }
  initialValue: {_type: string}
  isConnected: boolean
  onChange: (patches: any[]) => void
  schemaType: {name: string; title: string}
  markers: Array<{path: any[]}>
  history: {
    isLoadingEvents: boolean
    isOpen: boolean
    selectedEvent: any
    document: {
      isLoading: boolean
      snapshot: {_type: string}
    }
  }
  rev: string | null
}

const noop = () => undefined

const INITIAL_STATE = {
  focusPath: [],
  filterField: () => true
}

export default class FormView extends React.PureComponent<Props> {
  static defaultProps = {
    markers: [],
    isConnected: true,
    initialValue: undefined,
    rev: CURRENT_REVISION_FLAG
  }

  state = INITIAL_STATE

  filterFieldFnSubscription: any

  componentDidMount() {
    if (filterFieldFn$) {
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
    const {document, id, initialValue, history, markers, patchChannel, rev, schemaType} = this.props
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

    const showHistoricDocument = history.isOpen && rev !== CURRENT_REVISION_FLAG

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

        {afterEditorComponents.map((AfterEditorComponent: any, i: number) => (
          <AfterEditorComponent key={i} documentId={documentId} />
        ))}
      </div>
    )
  }
}
