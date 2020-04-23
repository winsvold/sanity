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
import {CURRENT_REVISION_FLAG} from '../../../constants'
import Delay from '../../../utils/Delay'
import {DocumentOperationResults} from './DocumentOperationResults'
import InspectHistory from './InspectHistory'
import InspectView from './InspectView'
import {Validation} from './Validation'
import {DocumentStatusBar, HistoryStatusBar} from './statusBar'
import FormView from './FormView'
import {getHistoryEventDateString} from './helpers'
import {HistoryState} from '../types'

import styles from './Editor.css'

interface Doc {
  _id: string
  _type: string
  _rev: string
  _updatedAt: string
}

interface Props {
  activeViewId: string
  connectionState: 'connecting' | 'connected' | 'reconnecting'
  documentId: string
  documentType: string
  formRef: any
  hasSiblings: boolean
  historyState: any
  initialValue: any
  inspect: any
  isClosable: boolean
  isCollapsed: boolean
  isHistoryOpen: boolean
  isSelected: boolean
  markers: any
  menuItemGroups: {id: string}[]
  menuItems: {title: string}[]
  onAction: () => void
  onChange: (patches: any[]) => void
  onCloseValidationResults: () => void
  onCloseView: () => void
  onCollapse: () => void
  onExpand: () => void
  onHideInspector: () => void
  onOpenHistory: () => void
  onSetActiveView: () => void
  onSetFocus: (path: any) => void
  onSplitPane?: () => void
  onToggleValidationResults: () => void
  paneKey: string
  paneTitle?: string
  revision: any
  rev: string
  selectedHistoryEvent?: any
  selectedHistoryEventIsLatest: boolean
  showValidationTooltip: boolean
  value: null | Doc
  views: any
}

function HistorySpinner({selectedHistoryEvent}: {selectedHistoryEvent?: string}) {
  const historyEventStr = selectedHistoryEvent
    ? getHistoryEventDateString(selectedHistoryEvent)
    : null

  return (
    <Delay ms={600}>
      <div className={styles.spinnerContainer}>
        <Spinner
          center
          message={`Loading revision${historyEventStr ? ` from ${historyEventStr}` : ''}…`}
        />
      </div>
    </Delay>
  )
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

function EditorFooter({
  documentId,
  documentType,
  historyState,
  initialValue,
  isHistoryOpen,
  onOpenHistory,
  rev,
  selectedHistoryEvent,
  value: valueProp
}: {
  documentId: string
  documentType: string
  historyState: HistoryState
  initialValue: any
  isHistoryOpen: boolean
  onOpenHistory: () => void
  rev: string
  selectedHistoryEvent: any
  value: any
}) {
  if (isHistoryOpen && rev !== CURRENT_REVISION_FLAG && selectedHistoryEvent) {
    const {events} = historyState

    return (
      <HistoryStatusBar
        id={documentId}
        type={documentType}
        selectedEvent={selectedHistoryEvent}
        isLatestEvent={events[0] === selectedHistoryEvent}
      />
    )
  }

  const value = valueProp || initialValue

  return (
    <DocumentStatusBar
      id={documentId}
      type={documentType}
      lastUpdated={value && value._updatedAt}
      onLastUpdatedButtonClick={onOpenHistory}
    />
  )
}

function DocumentView({
  activeViewId,
  connectionState,
  documentId,
  documentType,
  formRef,
  revision,
  historyState,
  initialValue,
  isHistoryOpen,
  markers,
  onChange,
  rev,
  selectedHistoryEvent,
  selectedHistoryEventIsLatest,
  value,
  views
}: {
  activeViewId: string
  connectionState: string
  documentId: string
  documentType: string
  formRef: any
  revision: any
  historyState: any
  initialValue: any
  isHistoryOpen: boolean
  markers: any
  onChange: (patches: any[]) => void
  rev: string
  selectedHistoryEvent: any
  selectedHistoryEventIsLatest: boolean
  value: null | Doc
  views: any[]
}) {
  // const typeName = options.type
  const schemaType = schema.get(documentType)
  const activeView = views.find(view => view.id === activeViewId) || views[0] || {type: 'form'}

  // Should be null if not displaying a revision revision
  const revisionSnapshot = selectedHistoryEventIsLatest
    ? value
    : revision.snapshot || revision.prevSnapshot

  const viewProps = {
    // "Documents"
    document: {
      published: value,
      draft: value,
      revision: revisionSnapshot,
      displayed: revisionSnapshot || value || initialValue
    },

    // Other stuff
    documentId,
    options: activeView.options,
    schemaType
  }

  const formProps = {
    ...viewProps,
    value: value,
    connectionState,
    markers,
    history: {
      isOpen: isHistoryOpen,
      selectedEvent: selectedHistoryEvent,
      isLoadingEvents: historyState.isLoading,
      isLoadingSnapshot: revision.isLoading,
      document: selectedHistoryEventIsLatest
        ? {
            isLoading: !selectedHistoryEvent,
            snapshot: value
          }
        : revision
    },
    onChange
  }

  switch (activeView.type) {
    case 'form':
      return <FormView {...formProps} id={documentId} ref={formRef} rev={rev} />
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
    historyState,
    initialValue,
    inspect,
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
    onHideInspector,
    onOpenHistory,
    onSetActiveView,
    onSetFocus,
    onSplitPane,
    onToggleValidationResults,
    paneKey,
    paneTitle,
    revision,
    rev,
    selectedHistoryEvent,
    selectedHistoryEventIsLatest,
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
      // options,
      showValidationTooltip
    ]
  )

  const paneFooter = (
    <EditorFooter
      documentId={documentId}
      documentType={documentType}
      historyState={historyState}
      initialValue={initialValue}
      isHistoryOpen={isHistoryOpen}
      onOpenHistory={onOpenHistory}
      rev={rev}
      selectedHistoryEvent={selectedHistoryEvent}
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
      {revision.isLoading && <HistorySpinner selectedHistoryEvent={selectedHistoryEvent} />}

      <DocumentView
        activeViewId={activeViewId}
        connectionState={connectionState}
        documentId={documentId}
        documentType={documentType}
        formRef={formRef}
        revision={revision}
        historyState={historyState}
        initialValue={initialValue}
        isHistoryOpen={isHistoryOpen}
        markers={markers}
        onChange={onChange}
        rev={rev}
        selectedHistoryEvent={selectedHistoryEvent}
        selectedHistoryEventIsLatest={selectedHistoryEventIsLatest}
        value={value}
        views={views}
      />

      {inspect && isHistoryOpen && revision && (
        <InspectHistory document={revision} onClose={onHideInspector} />
      )}

      {inspect && !isHistoryOpen && value && (
        <InspectView value={value} onClose={onHideInspector} />
      )}

      {connectionState === 'reconnecting' && (
        <Snackbar kind="warning" isPersisted title="Connection lost. Reconnecting…" />
      )}

      <DocumentOperationResults id={documentId} type={documentType} />
    </TabbedPane>
  )
}

export default Editor
