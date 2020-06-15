/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import schema from 'part:@sanity/base/schema'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import {usePaneRouter} from '../../contexts/PaneRouterContext'
import isNarrowScreen from '../../utils/isNarrowScreen'
import windowWidth$ from '../../utils/windowWidth'
import {ErrorPane} from '../errorPane'
import {LoadingPane} from '../loadingPane'
import {ChangesInspector} from './changesInspector'
import {HISTORY_BREAKPOINT_MIN} from './constants'
import {Editor} from './editor'
import {useDocumentHistory} from './history'
import {HistoryNavigator} from './historyNavigator'
import {getMenuItems, getProductionPreviewItem} from './menuItems'
import {DocumentActionShortcuts, isInspectHotkey, isPreviewHotkey} from './keyboardShortcuts'
import {Doc, DocumentViewType, MenuAction} from './types'

import styles from './DocumentPane.css'

declare const __DEV__: boolean

interface Props {
  title?: string
  paneKey: string
  type: any
  published: null | Doc
  draft: null | Doc
  value: null | Doc
  connectionState: 'connecting' | 'connected' | 'reconnecting'
  isSelected: boolean
  isCollapsed: boolean
  markers: any[]
  onChange: (patches: any[]) => void
  isClosable: boolean
  onExpand?: () => void
  onCollapse?: () => void
  menuItems: MenuAction[]
  menuItemGroups: {id: string}[]
  views: DocumentViewType[]
  initialValue?: Doc
  options: {
    id: string
    type: string
    template?: string
  }
  urlParams: {
    view: string
    rev: string
  }
}

function getInitialValue(props: Props): Doc {
  const {initialValue = {}, options, value} = props
  const base = {_type: options.type}

  return value ? base : {...base, ...initialValue}
}

function DocumentPane(props: Props) {
  const {
    isSelected,
    isCollapsed,
    isClosable,
    markers,
    menuItemGroups = [],
    onChange,
    onCollapse,
    connectionState,
    onExpand,
    options,
    paneKey,
    title = '',
    urlParams,
    value,
    draft,
    published,
    views = []
  } = props

  const documentId = getPublishedId(options.id)
  const typeName = options.type
  const schemaType = schema.get(typeName)

  // Contexts
  const paneRouter = usePaneRouter()
  const history = useDocumentHistory({documentId, urlParams, draft, published})

  // React.useEffect(() => console.log('history', history), [history])

  const {
    historyState,
    openHistory,
    revision,
    selectedHistoryEvent,
    selectedHistoryEventIsLatest,
    selection,
    selectionRange,
    setSelection
  } = history

  // Refs
  const formRef = React.useRef<any | null>(null)
  const documentIdRef = React.useRef<string>(documentId)

  // States
  const [hasNarrowScreen, setHasNarrowScreen] = React.useState<boolean>(isNarrowScreen())
  const [isHistoryEnabled, setIsHistoryEnabled] = React.useState<boolean>(
    window && window.innerWidth > HISTORY_BREAKPOINT_MIN
  )
  const [inspect, setInspect] = React.useState<boolean>(false)
  const [showValidationTooltip, setShowValidationTooltip] = React.useState<boolean>(false)

  // Inferred values
  const canShowHistoryList = paneRouter.siblingIndex === 0 && !isCollapsed && isHistoryEnabled
  const isLastSibling = paneRouter.siblingIndex === paneRouter.groupLength - 1
  const canShowChangesList = isLastSibling && !isCollapsed && isHistoryEnabled
  const isHistoryOpen = Boolean(urlParams.rev)

  const initialValue = getInitialValue(props)
  const activeViewId = paneRouter.params.view || (views[0] && views[0].id)
  const menuItems =
    getMenuItems({
      value,
      isHistoryEnabled,
      isHistoryOpen,
      isLiveEditEnabled: schemaType.liveEdit === true,
      rev: selectedHistoryEvent && selectedHistoryEvent.rev,
      canShowHistoryList
    }) || []

  // Callbacks

  const handleOpenHistory = () => {
    if (!canShowHistoryList || isHistoryOpen) {
      return
    }

    openHistory()
  }

  const handleToggleInspect = () => {
    if (!value) return
    setInspect(val => !val)
  }

  const handleKeyUp = (event: any) => {
    if (event.key === 'Escape' && showValidationTooltip) {
      setShowValidationTooltip(false)
    }

    if (isInspectHotkey(event) && !isHistoryOpen) {
      handleToggleInspect()
    }

    if (isPreviewHotkey(event)) {
      // const {draft, published} = props
      const item = getProductionPreviewItem({
        value,
        rev: selectedHistoryEvent && selectedHistoryEvent.rev
      })

      if (item && item.url) window.open(item.url)
    }
  }

  const handleCloseValidationResults = () => {
    setShowValidationTooltip(false)
  }

  const handleClosePane = () => {
    paneRouter.closeCurrent()
  }

  const handleHideInspector = () => {
    setInspect(false)
  }

  const handleMenuAction = (item: MenuAction) => {
    if (item.action === 'production-preview') {
      window.open(item.url)
      return true
    }
    if (item.action === 'inspect') {
      setInspect(true)
      return true
    }
    if (item.action === 'browseHistory') {
      handleOpenHistory()
      return true
    }
    return false
  }

  const handleSetActiveView = (id: string) => {
    paneRouter.setView(id)
  }

  const handleSetFocus = (path: any) => {
    if (formRef.current) {
      formRef.current.handleFocus(path)
    }
  }

  const handleSplitPane = () => {
    if (hasNarrowScreen) return
    paneRouter.duplicateCurrent()
  }

  const handleToggleValidationResults = () => {
    setShowValidationTooltip(val => !val)
  }

  const handleCloseHistory = React.useCallback(() => {
    const {rev: revParam, ...params} = paneRouter.params

    if (revParam) {
      paneRouter.setParams(params, {recurseIfInherited: true})
    }
  }, [paneRouter])

  const handleResize = React.useCallback(() => {
    const historyEnabled = window && window.innerWidth > HISTORY_BREAKPOINT_MIN
    const newHasNarrowScreen = isNarrowScreen()

    if (isHistoryEnabled !== historyEnabled) {
      setIsHistoryEnabled(historyEnabled)
    }

    if (hasNarrowScreen !== newHasNarrowScreen) {
      setHasNarrowScreen(newHasNarrowScreen)
    }
  }, [isHistoryEnabled, setIsHistoryEnabled, hasNarrowScreen, setHasNarrowScreen])

  // Monitor screen size, and disable history on narrow screens
  React.useEffect(() => {
    const resizeSubscriber = windowWidth$.subscribe(handleResize)
    return () => resizeSubscriber.unsubscribe()
  }, [isHistoryEnabled])

  // Reset document state
  React.useEffect(() => {
    const prevPublishedId = documentIdRef.current
    documentIdRef.current = documentId
    if (documentId !== prevPublishedId) {
      console.log('TODO: reset state')
    }
  }, [documentId])

  if (!schemaType) {
    return (
      <ErrorPane
        {...props}
        color="warning"
        title={
          <>
            Unknown document type: <code>{typeName}</code>
          </>
        }
      >
        {typeName && (
          <p>
            This document has the schema type <code>{typeName}</code>, which is not defined as a
            type in the local content studio schema.
          </p>
        )}
        {!typeName && <p>This document does not exist, and no schema type was specified for it.</p>}
        {__DEV__ && value && (
          <div>
            <h4>Here is the JSON representation of the document:</h4>
            <pre>
              <code>{JSON.stringify(value, null, 2)}</code>
            </pre>
          </div>
        )}
      </ErrorPane>
    )
  }

  if (connectionState === 'connecting') {
    return <LoadingPane {...props} delay={600} message={`Loading ${schemaType.title}…`} />
  }

  if (!documentId) {
    return <div>No document ID</div>
  }

  const revisionIsLoading = revision.from.isLoading && revision.to.isLoading
  const showHistoryNavigator = isHistoryOpen && canShowHistoryList
  const showChangesInspector = isHistoryOpen && canShowChangesList

  return (
    <DocumentActionShortcuts
      id={options.id}
      type={typeName}
      onKeyUp={handleKeyUp}
      className={isHistoryOpen ? styles.withHistoryMode : styles.root}
    >
      {showHistoryNavigator && (
        <div className={styles.navigatorContainer} key="navigator">
          <HistoryNavigator
            events={historyState.events}
            isLoading={historyState.isLoading}
            error={historyState.error}
            onSelect={setSelection}
            selection={selection}
            selectionRange={selectionRange}
          />
        </div>
      )}

      <div className={styles.editorContainer} key="editor">
        <Editor
          activeViewId={activeViewId}
          connectionState={connectionState}
          documentId={options.id}
          documentType={options.type}
          formRef={formRef}
          hasSiblings={paneRouter.hasGroupSiblings}
          revision={revision.to}
          historyState={historyState}
          initialValue={initialValue}
          inspect={inspect}
          isClosable={isClosable}
          isCollapsed={isCollapsed}
          isHistoryOpen={isHistoryOpen}
          isSelected={isSelected}
          markers={markers}
          menuItemGroups={menuItemGroups}
          menuItems={menuItems}
          onAction={handleMenuAction}
          onChange={onChange}
          onCloseValidationResults={handleCloseValidationResults}
          onCloseView={handleClosePane}
          onCollapse={onCollapse}
          onExpand={onExpand}
          onHideInspector={handleHideInspector}
          onOpenHistory={handleOpenHistory}
          onSetActiveView={handleSetActiveView}
          onSetFocus={handleSetFocus}
          onSplitPane={handleSplitPane}
          onToggleValidationResults={handleToggleValidationResults}
          paneTitle={title}
          paneKey={paneKey}
          selectedHistoryEvent={selectedHistoryEvent}
          selectedHistoryEventIsLatest={selectedHistoryEventIsLatest}
          showValidationTooltip={showValidationTooltip}
          value={value}
          views={views}
        />
      </div>

      {showChangesInspector && history.diff && (
        <div className={styles.inspectorContainer} key="inspector">
          <ChangesInspector
            documentId={documentId}
            diff={history.diff}
            isLoading={revisionIsLoading}
            onHistoryClose={handleCloseHistory}
            schemaType={schemaType}
          />
        </div>
      )}
    </DocumentActionShortcuts>
  )
}

export default DocumentPane
