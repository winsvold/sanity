/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-multi-comp */

import * as React from 'react'
import {PreviewFields} from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import Spinner from 'part:@sanity/components/loading/spinner'
import TabbedPane from 'part:@sanity/components/panes/tabbed'
import Snackbar from 'part:@sanity/components/snackbar/default'
import LanguageFilter from 'part:@sanity/desk-tool/language-select-component?'
import Delay from '../../../utils/Delay'
import {Doc, DocumentViewType, MenuAction} from '../types'
import {DocumentOperationResults} from './DocumentOperationResults'
import InspectHistory from './InspectHistory'
import InspectView from './InspectView'
import {Validation} from './Validation'
import {DocumentStatusBar, HistoryStatusBar} from './statusBar'
import FormView from './FormView'

import styles from './Editor.css'

interface Props {
  activeViewId: string
  connectionState: 'connecting' | 'connected' | 'reconnecting'
  documentId: string
  documentType: string
  formRef: React.RefObject<any>
  hasSiblings: boolean
  initialValue: Doc
  isClosable: boolean
  isCollapsed: boolean
  isHistoryOpen: boolean
  isSelected: boolean
  markers: any
  menuItemGroups: {id: string}[]
  menuItems: MenuAction[]
  onAction: (item: MenuAction) => boolean
  onChange: (patches: any[]) => void
  onCloseValidationResults: () => void
  onCloseView: () => void
  onCollapse?: () => void
  onExpand?: () => void
  onSetActiveView: (id: string) => void
  onSetFocus: (path: any) => void
  onSplitPane?: () => void
  onToggleValidationResults: () => void
  paneKey: string
  paneTitle?: string
  showValidationTooltip: boolean
  value: Doc | null
  views: DocumentViewType[]
}

function PaneHeaderActions(props: {
  documentId: string
  documentType: string
  markers: any
  onCloseValidationResults: () => void
  onSetFocus: (path: any) => void
  onToggleValidationResults: () => void
  showValidationTooltip: boolean
}) {
  const {
    documentId,
    documentType,
    markers,
    onCloseValidationResults,
    onSetFocus,
    onToggleValidationResults,
    showValidationTooltip
  } = props

  return (
    <div className={styles.paneFunctions}>
      {LanguageFilter && <LanguageFilter />}
      <Validation
        id={documentId}
        type={documentType}
        markers={markers}
        showValidationTooltip={showValidationTooltip}
        onCloseValidationResults={onCloseValidationResults}
        onToggleValidationResults={onToggleValidationResults}
        onFocus={onSetFocus}
      />
    </div>
  )
}

function DocumentFooter({
  documentId,
  documentType,
  initialValue,
  value: valueProp
}: {
  documentId: string
  documentType: string
  initialValue: Doc
  value: Doc | null
}) {
  const value = valueProp || initialValue

  return (
    <DocumentStatusBar
      id={documentId}
      type={documentType}
      lastUpdated={value && value._updatedAt}
      onLastUpdatedButtonClick={() => {}}
    />
  )
}

function DocumentView({
  activeViewId,
  connectionState,
  documentId,
  documentType,
  formRef,
  initialValue,
  isHistoryOpen,
  markers,
  onChange,
  value,
  views
}: {
  activeViewId: string
  connectionState: string
  documentId: string
  documentType: string
  formRef: React.RefObject<any>
  initialValue: Doc
  isHistoryOpen: boolean
  markers: any
  onChange: (patches: any[]) => void
  value: Doc | null
  views: {
    type: string
    id: string
    title: string
    options: {}
    component: React.ComponentType<any>
  }[]
}) {
  // const typeName = options.type
  const schemaType = schema.get(documentType)
  const activeView = views.find(view => view.id === activeViewId) || views[0] || {type: 'form'}

  const viewProps = {
    // Other stuff
    documentId,
    options: activeView.options,
    schemaType
  }

  const formProps = {
    ...viewProps,
    value: value,
    connectionState,
    initialValue,
    isHistoryOpen,
    markers,
    onChange,
    showHistoric: false
  }

  switch (activeView.type) {
    case 'form':
      return <FormView {...formProps} id={documentId} ref={formRef} />
    case 'component':
      return <activeView.component {...viewProps} />
    default:
      return null
  }
}

function DocumentHeaderTitle({
  documentType,
  paneTitle,
  value
}: {
  documentType: string
  paneTitle?: string
  value: Doc | null
}) {
  const type = schema.get(documentType)

  if (paneTitle) {
    return <span>{paneTitle}</span>
  }

  if (!value) {
    return <>New {type.title || type.name}</>
  }

  return (
    <PreviewFields document={value} type={type} fields={['title']}>
      {({title}) => (title ? <span>{title}</span> : <em>Untitled</em>)}
    </PreviewFields>
  )
}

function Editor(props: Props) {
  const {
    activeViewId,
    connectionState,
    documentId,
    documentType,
    formRef,
    hasSiblings,
    initialValue,
    isClosable,
    isCollapsed,
    isHistoryOpen,
    isSelected,
    markers,
    menuItemGroups,
    menuItems,
    onAction,
    onChange,
    onCloseValidationResults,
    onCloseView,
    onCollapse,
    onExpand,
    onSetActiveView,
    onSetFocus,
    onSplitPane,
    onToggleValidationResults,
    paneKey,
    paneTitle,
    showValidationTooltip,
    value,
    views
  } = props

  const paneHeaderTitle = (
    <DocumentHeaderTitle documentType={documentType} paneTitle={paneTitle} value={value} />
  )

  const renderPaneHeaderActions = React.useCallback(
    () =>
      isHistoryOpen ? null : (
        <PaneHeaderActions
          documentId={documentId}
          documentType={documentType}
          markers={markers}
          onCloseValidationResults={onCloseValidationResults}
          onSetFocus={onSetFocus}
          onToggleValidationResults={onToggleValidationResults}
          showValidationTooltip={showValidationTooltip}
        />
      ),
    [
      isHistoryOpen,
      documentId,
      markers,
      onCloseValidationResults,
      onSetFocus,
      onToggleValidationResults,
      showValidationTooltip
    ]
  )

  const paneFooter = (
    <DocumentFooter
      documentId={documentId}
      documentType={documentType}
      initialValue={initialValue}
      value={value}
    />
  )

  return (
    <TabbedPane
      key="pane"
      idPrefix={paneKey}
      title={paneHeaderTitle}
      views={views}
      activeView={activeViewId}
      onSetActiveView={onSetActiveView}
      onSplitPane={onSplitPane}
      onCloseView={onCloseView}
      menuItemGroups={menuItemGroups}
      isSelected={isSelected}
      isCollapsed={isCollapsed}
      onCollapse={onCollapse}
      onExpand={onExpand}
      onAction={onAction}
      menuItems={menuItems}
      footer={paneFooter}
      renderActions={renderPaneHeaderActions}
      isClosable={isClosable}
      hasSiblings={hasSiblings}
    >
      {/* {revision.isLoading && <HistorySpinner selectedHistoryEvent={selectedHistoryEvent} />} */}

      <DocumentView
        activeViewId={activeViewId}
        connectionState={connectionState}
        documentId={documentId}
        documentType={documentType}
        formRef={formRef}
        initialValue={initialValue}
        isHistoryOpen={isHistoryOpen}
        markers={markers}
        onChange={onChange}
        value={value}
        views={views}
      />

      {connectionState === 'reconnecting' && (
        <Snackbar kind="warning" isPersisted title="Connection lost. Reconnecting…" />
      )}

      <DocumentOperationResults id={documentId} type={documentType} />
    </TabbedPane>
  )
}

export default Editor
