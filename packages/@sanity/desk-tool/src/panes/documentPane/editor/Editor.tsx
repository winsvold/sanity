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
import {DocumentOperationResults} from './DocumentOperationResults'
import InspectHistory from './InspectHistory'
import InspectView from './InspectView'
import {Validation} from './Validation'
import {DocumentStatusBar, HistoryStatusBar} from './statusBar'
import FormView from './FormView'
import {getHistoryEventDateString} from './helpers'

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
  formRef: any
  hasSiblings: boolean
  historical: any
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
  options: {
    id: string
    type: string
    template?: string
  }
  paneKey: string
  paneTitle?: string
  publishedId: string
  selectedHistoryEvent?: any
  selectedIsLatest: boolean
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

function PaneHeaderActions(props: any) {
  const {
    options,
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
        id={options.id}
        type={options.type}
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
  historyState,
  initialValue,
  isHistoryOpen,
  onOpenHistory,
  options,
  selectedHistoryEvent,
  value: valueProp
}: {
  historyState: any
  initialValue: any
  isHistoryOpen: boolean
  onOpenHistory: () => void
  options: any
  selectedHistoryEvent: any
  value: any
}) {
  if (isHistoryOpen && selectedHistoryEvent) {
    const {events} = historyState

    return (
      <HistoryStatusBar
        id={options.id}
        type={options.type}
        selectedEvent={selectedHistoryEvent}
        isLatestEvent={events[0] === selectedHistoryEvent}
      />
    )
  }

  const value = valueProp || initialValue

  return (
    <DocumentStatusBar
      id={options.id}
      type={options.type}
      lastUpdated={value && value._updatedAt}
      onLastUpdatedButtonClick={onOpenHistory}
    />
  )
}

function DocumentView({
  activeViewId,
  connectionState,
  formRef,
  historical,
  historyState,
  initialValue,
  isHistoryOpen,
  markers,
  onChange,
  options,
  publishedId,
  selectedHistoryEvent,
  selectedIsLatest,
  value,
  views
}: {
  activeViewId: string
  connectionState: string
  formRef: any
  historical: any
  historyState: any
  initialValue: any
  isHistoryOpen: boolean
  markers: any
  onChange: (patches: any[]) => void
  options: any
  publishedId: string
  selectedHistoryEvent: any
  selectedIsLatest: boolean
  value: null | Doc
  views: any[]
}) {
  const typeName = options.type
  const schemaType = schema.get(typeName)
  const activeView = views.find(view => view.id === activeViewId) || views[0] || {type: 'form'}

  // Should be null if not displaying a historical revision
  const historicalSnapshot = selectedIsLatest
    ? value
    : historical.snapshot || historical.prevSnapshot

  const viewProps = {
    // "Documents"
    document: {
      published: value,
      draft: value,
      historical: historicalSnapshot,
      displayed: historicalSnapshot || value || initialValue
    },

    // Other stuff
    documentId: publishedId,
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
      isLoadingSnapshot: historical.isLoading,
      document: selectedIsLatest
        ? {
            isLoading: !selectedHistoryEvent,
            snapshot: value
          }
        : historical
    },
    onChange
  }

  switch (activeView.type) {
    case 'form':
      return <FormView ref={formRef} id={formProps.documentId} {...formProps} />
    case 'component':
      return <activeView.component {...viewProps} />
    default:
      return null
  }
}

function DocumentHeaderTitle({
  options,
  paneTitle,
  value
}: {
  options: {
    id: string
    type: string
    template?: string
  }
  paneTitle?: string
  value: Doc | null
}) {
  const typeName = options.type
  const type = schema.get(typeName)

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
    formRef,
    hasSiblings,
    historical,
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
    options,
    paneKey,
    paneTitle,
    publishedId,
    selectedHistoryEvent,
    selectedIsLatest,
    showValidationTooltip,
    value,
    views
  } = props

  const paneHeaderTitle = (
    <DocumentHeaderTitle options={options} paneTitle={paneTitle} value={value} />
  )

  const renderPaneHeaderActions = React.useCallback(
    () =>
      isHistoryOpen ? null : (
        <PaneHeaderActions
          markers={markers}
          onCloseValidationResults={onCloseValidationResults}
          onSetFocus={onSetFocus}
          onToggleValidationResults={onToggleValidationResults}
          options={options}
          showValidationTooltip={showValidationTooltip}
        />
      ),
    [
      isHistoryOpen,
      markers,
      onCloseValidationResults,
      onSetFocus,
      onToggleValidationResults,
      options,
      showValidationTooltip
    ]
  )

  const paneFooter = (
    <EditorFooter
      historyState={historyState}
      initialValue={initialValue}
      isHistoryOpen={isHistoryOpen}
      onOpenHistory={onOpenHistory}
      options={options}
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
      {historical.isLoading && <HistorySpinner selectedHistoryEvent={selectedHistoryEvent} />}

      <DocumentView
        activeViewId={activeViewId}
        connectionState={connectionState}
        formRef={formRef}
        historical={historical}
        historyState={historyState}
        initialValue={initialValue}
        isHistoryOpen={isHistoryOpen}
        markers={markers}
        publishedId={publishedId}
        onChange={onChange}
        options={options}
        selectedHistoryEvent={selectedHistoryEvent}
        selectedIsLatest={selectedIsLatest}
        value={value}
        views={views}
      />

      {inspect && isHistoryOpen && historical && (
        <InspectHistory document={historical} onClose={onHideInspector} />
      )}

      {inspect && !isHistoryOpen && value && (
        <InspectView value={value} onClose={onHideInspector} />
      )}

      {connectionState === 'reconnecting' && (
        <Snackbar kind="warning" isPersisted title="Connection lost. Reconnecting…" />
      )}

      <DocumentOperationResults id={options.id} type={options.type} />
    </TabbedPane>
  )
}

export default Editor
