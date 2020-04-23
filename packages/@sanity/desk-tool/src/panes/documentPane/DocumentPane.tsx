/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import schema from 'part:@sanity/base/schema'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import isNarrowScreen from '../../utils/isNarrowScreen'
import windowWidth$ from '../../utils/windowWidth'
import {HistoryNavigator} from './historyNavigator'
import {getMenuItems, getProductionPreviewItem} from './documentPaneMenuItems'
import {PaneRouterContext} from '../../contexts/PaneRouterContext'
import {DocumentActionShortcuts} from './DocumentActionShortcuts'
import {ChangesInspector} from './changesInspector'
import {CURRENT_REVISION_FLAG} from '../../constants'
import {BREAKPOINT_SCREEN_MEDIUM} from './constants'
import {Editor} from './editor'
import {ErrorPane} from '../errorPane'
import {LoadingPane} from '../loadingPane'
import {isInspectHotkey, isPreviewHotkey} from './helpers'
import {useDocumentHistory} from './history'
import {Doc} from './types'

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
  menuItems: {title: string}[]
  menuItemGroups: {id: string}[]
  views: {
    type: string
    id: string
    title: string
    options: {}
    component: React.ComponentType<any>
  }[]
  initialValue?: {[field: string]: any}
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

function getInitialValue(props: Props) {
  const {initialValue = {}, options, value} = props
  const base = {_type: options.type}

  return value ? base : {...base, ...initialValue}
}

function usePaneRouterContext() {
  return React.useContext(PaneRouterContext)
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
    views = []
  } = props

  const documentId = getPublishedId(options.id)
  const typeName = options.type
  const schemaType = schema.get(typeName)
  const rev = urlParams.rev || null

  // Contexts
  const paneRouter: any = usePaneRouterContext()
  const {
    historyState,
    revision,
    selectedHistoryEvent,
    selectedHistoryEventIsLatest
  } = useDocumentHistory({documentId, rev})

  // Refs
  const formRef = React.useRef<any | null>(null)
  const documentIdRef = React.useRef<string>(documentId)

  // States
  const [hasNarrowScreen, setHasNarrowScreen] = React.useState<boolean>(isNarrowScreen())
  const [isHistoryEnabled, setIsHistoryEnabled] = React.useState<boolean>(
    window && window.innerWidth > BREAKPOINT_SCREEN_MEDIUM
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
  const menuItems = getMenuItems({
    value,
    isHistoryEnabled,
    isHistoryOpen,
    isLiveEditEnabled: schemaType.liveEdit === true,
    rev: selectedHistoryEvent && selectedHistoryEvent.rev,
    canShowHistoryList
  })

  // Callbacks

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

  const handleHistorySelect = (historyEvent: any) => {
    const eventisCurrent = historyState.events[0] === historyEvent

    paneRouter.setParams(
      {...paneRouter.params, rev: eventisCurrent ? CURRENT_REVISION_FLAG : historyEvent.rev},
      {recurseIfInherited: true}
    )
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

  const handleOpenHistory = () => {
    if (!canShowHistoryList || isHistoryOpen) {
      return
    }

    paneRouter.setParams(
      {...paneRouter.params, rev: CURRENT_REVISION_FLAG},
      {recurseIfInherited: true}
    )
  }

  const handleMenuAction = (item: {
    action: 'production-preview' | 'inspect' | 'browseHistory'
    url?: string
  }) => {
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

  const handleSetActiveView = (...args: any[]) => {
    paneRouter.setView(...args)
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
    const historyEnabled = window && window.innerWidth > BREAKPOINT_SCREEN_MEDIUM
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

  return (
    <DocumentActionShortcuts
      id={options.id}
      type={typeName}
      onKeyUp={handleKeyUp}
      className={isHistoryOpen ? styles.withHistoryMode : styles.root}
    >
      {isHistoryOpen && canShowHistoryList && (
        <div className={styles.navigatorContainer} key="navigator">
          <HistoryNavigator
            documentId={documentId}
            onItemSelect={handleHistorySelect}
            events={historyState.events}
            isLoading={historyState.isLoading}
            error={historyState.error}
            selectedEvent={selectedHistoryEvent}
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
          revision={revision}
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
          publishedId={documentId}
          rev={rev}
          selectedHistoryEvent={selectedHistoryEvent}
          selectedHistoryEventIsLatest={selectedHistoryEventIsLatest}
          showValidationTooltip={showValidationTooltip}
          value={value}
          views={views}
        />
      </div>

      {isHistoryOpen && canShowChangesList && (
        <div className={styles.inspectorContainer} key="inspector">
          <ChangesInspector onHistoryClose={handleCloseHistory} />
        </div>
      )}
    </DocumentActionShortcuts>
  )
}

export default DocumentPane
