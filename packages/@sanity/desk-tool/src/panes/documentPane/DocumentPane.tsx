/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import client from 'part:@sanity/base/client'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import {usePaneRouter} from '../../contexts/PaneRouterContext'
import {Editor} from './editor'
import {getMenuItems, getProductionPreviewItem} from './menuItems'
import {DocumentActionShortcuts, isInspectHotkey, isPreviewHotkey} from './keyboardShortcuts'
import {Doc, DocumentViewType, MenuAction} from './types'

import styles from './DocumentPane.css'
import {createObservableController} from './history/controller'
import {Timeline} from './history/timeline'
import InspectView from './editor/InspectView'
import RevisionSummary from './RevisionSummary'
import ChangeSummary from './ChangeSummary'
import HistoryTimeline from './HistoryTimeline'
import {useObservable} from '@sanity/react-hooks'

declare const __DEV__: boolean

interface Props {
  title?: string
  paneKey: string
  type: any
  published: null | Doc
  draft: null | Doc
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
  schemaType: any
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
  const {initialValue = {}, options} = props
  const base = {_type: options.type}

  return initialValue ? {...base, ...initialValue} : base
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
    draft,
    published,
    schemaType,
    views = []
  } = props

  const documentId = getPublishedId(options.id)
  const typeName = options.type

  // Contexts
  const paneRouter = usePaneRouter()

  const [timeline] = React.useState(
    () =>
      new Timeline({
        publishedId: documentId,
        draft,
        published
      })
  )

  const historyState = useObservable(
    createObservableController({
      timeline,
      documentId,
      client
    }),
    {error: new Error('should not happen')}
  )

  if (historyState.error) throw historyState.error
  const historyController = historyState.controller

  // TODO: Fetch only when open
  React.useEffect(() => {
    historyController.update({
      fetchAtLeast: 5
    })
  })

  // React.useEffect(() => console.log('history', history), [history])

  // Refs
  const formRef = React.useRef<any | null>(null)
  const documentIdRef = React.useRef<string>(documentId)

  const [showValidationTooltip, setShowValidationTooltip] = React.useState<boolean>(false)

  const initialValue = getInitialValue(props)
  const value = draft || published || initialValue

  const activeViewId = paneRouter.params.view || (views[0] && views[0].id)
  const inspect = paneRouter.params.inspect === 'on'
  const startTimeId = paneRouter.params.startTime
  const startTime = React.useMemo(() => (startTimeId ? timeline.parseTimeId(startTimeId) : null), [
    startTimeId,
    historyController.version
  ])

  if (startTimeId && !startTime) {
    // TODO: The chunk is not available yet
  }

  const isHistoryOpen = startTime != null

  const menuItems =
    getMenuItems({
      value,
      isHistoryEnabled: true,
      canShowHistoryList: true,
      isHistoryOpen,
      isLiveEditEnabled: schemaType.liveEdit === true,
      rev: startTime ? startTime.chunk.id : null
    }) || []

  // Callbacks

  const toggleInspect = (toggle: boolean = !inspect) => {
    const {inspect, ...params} = paneRouter.params
    if (toggle) {
      paneRouter.setParams({inspect: 'on', ...params})
    } else {
      paneRouter.setParams(params)
    }
  }

  const toggleHistory = (newStartTime: string | null = startTime ? null : '-') => {
    const {startTime, ...params} = paneRouter.params
    if (newStartTime) {
      paneRouter.setParams({startTime: newStartTime, ...params})
    } else {
      paneRouter.setParams(params)
    }
  }

  const handleKeyUp = (event: any) => {
    if (event.key === 'Escape' && showValidationTooltip) {
      setShowValidationTooltip(false)
    }

    if (isInspectHotkey(event)) {
      toggleInspect()
    }

    if (isPreviewHotkey(event)) {
      // const {draft, published} = props
      const item = getProductionPreviewItem({
        value,
        rev: null
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

  const handleMenuAction = (item: MenuAction) => {
    if (item.action === 'production-preview') {
      window.open(item.url)
      return true
    }
    if (item.action === 'inspect') {
      toggleInspect(true)
      return true
    }
    if (item.action === 'browseHistory') {
      toggleHistory('-')
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
    paneRouter.duplicateCurrent()
  }

  const handleToggleValidationResults = () => {
    setShowValidationTooltip(val => !val)
  }

  // Reset document state
  React.useEffect(() => {
    const prevPublishedId = documentIdRef.current
    documentIdRef.current = documentId
    if (documentId !== prevPublishedId) {
      console.log('TODO: reset state')
    }
  }, [documentId])

  if (!documentId) {
    return <div>No document ID</div>
  }

  // TODO: Maybe history state belongs somewhere else since `value` is a props here
  let displayed = value

  if (startTime) {
    timeline.setRange(startTime, null)
    displayed = timeline.endAttributes()
  }

  return (
    <DocumentActionShortcuts
      id={options.id}
      type={typeName}
      onKeyUp={handleKeyUp}
      className={styles.root}
    >
      {isHistoryOpen && <RevisionSummary />}

      <div className={styles.container}>
        {isHistoryOpen && (
          <HistoryTimeline timeline={timeline} onSelect={time => toggleHistory(time)} />
        )}

        <div className={styles.editorContainer} key="editor">
          {inspect && <InspectView value={value} onClose={() => toggleInspect(false)} />}

          <Editor
            activeViewId={activeViewId}
            connectionState={connectionState}
            documentId={options.id}
            documentType={options.type}
            formRef={formRef}
            hasSiblings={paneRouter.hasGroupSiblings}
            initialValue={initialValue}
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
            onSetActiveView={handleSetActiveView}
            onSetFocus={handleSetFocus}
            onSplitPane={handleSplitPane}
            onToggleValidationResults={handleToggleValidationResults}
            paneTitle={title}
            paneKey={paneKey}
            showValidationTooltip={showValidationTooltip}
            value={displayed}
            views={views}
          />
        </div>

        {isHistoryOpen && <ChangeSummary diff={timeline.currentDiff()} />}
      </div>
    </DocumentActionShortcuts>
  )
}

export default DocumentPane
