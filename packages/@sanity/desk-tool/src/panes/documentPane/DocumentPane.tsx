/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import {noop} from 'lodash'
import {from, Subscription} from 'rxjs'
import {map} from 'rxjs/operators'
import schema from 'part:@sanity/base/schema'
import {PreviewFields} from 'part:@sanity/base/preview'
import historyStore from 'part:@sanity/base/datastore/history'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import isNarrowScreen from '../../utils/isNarrowScreen'
import windowWidth$ from '../../utils/windowWidth'
import {HistoryNavigator} from './historyNavigator'
import {historyIsEnabled} from './history'
import {getMenuItems, getProductionPreviewItem} from './documentPaneMenuItems'
import {PaneRouterContext} from '../../contexts/PaneRouterContext'
import {DocumentActionShortcuts} from './DocumentActionShortcuts'
import {ChangesInspector} from './changesInspector'
import {Editor} from './editor'
import {ErrorPane} from '../errorPane'
import {LoadingPane} from '../loadingPane'

import styles from './DocumentPane.css'

declare const __DEV__: boolean

const DEBUG_HISTORY_TRANSITION = false
const CURRENT_REVISION_FLAG = '-'
const KEY_I = 73
const KEY_O = 79

function debugHistory(...args: any[]) {
  if (DEBUG_HISTORY_TRANSITION) {
    const logLine = typeof args[0] === 'string' ? `[HISTORY] ${args[0]}` : '[HISTORY] '
    // eslint-disable-next-line no-console
    console.log(logLine, ...args.slice(1))
  }
}

function isInspectHotkey(event) {
  return event.ctrlKey && event.keyCode === KEY_I && event.altKey && !event.shiftKey
}

function isPreviewHotkey(event) {
  return event.ctrlKey && event.keyCode === KEY_O && event.altKey && !event.shiftKey
}

interface Doc {
  _id: string
  _type: string
  _rev: string
  _updatedAt: string
}

interface HistoricalDocumentState {
  isLoading: boolean
  snapshot: null | Doc
  prevSnapshot: null | Doc
}

interface HistoryState {
  isEnabled: boolean
  isLoading: boolean
  error: null | Error
  events: any[]
}

interface State {
  historical: HistoricalDocumentState
  historyState: HistoryState
  history: any
  hasNarrowScreen: boolean
  inspect: boolean
  isMenuOpen: boolean
  showValidationTooltip: boolean
}

const INITIAL_HISTORICAL_DOCUMENT_STATE: HistoricalDocumentState = {
  isLoading: false,
  snapshot: null,
  prevSnapshot: null
}

const INITIAL_HISTORY_STATE: HistoryState = {
  isEnabled: historyIsEnabled(),
  isLoading: true,
  error: null,
  events: []
}

const INITIAL_STATE: State = {
  isMenuOpen: false,
  hasNarrowScreen: isNarrowScreen(),
  inspect: false,
  showValidationTooltip: false,
  historical: INITIAL_HISTORICAL_DOCUMENT_STATE,
  historyState: INITIAL_HISTORY_STATE,
  history: {}
}

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

export default class DocumentPane extends React.PureComponent<Props, State> {
  _historyEventsSubscription?: Subscription
  _historyFetchDocSubscription?: Subscription
  resizeSubscriber?: Subscription
  _isMounted?: boolean
  subscription?: Subscription

  static contextType = PaneRouterContext

  static defaultProps = {
    title: '',
    views: [],
    menuItems: [],
    menuItemGroups: []
  }

  state = {...INITIAL_STATE, hasNarrowScreen: isNarrowScreen()}
  formRef: React.RefObject<HTMLFormElement> = React.createRef()

  constructor(props: Props, context: any) {
    super(props)
    this.setup(props.options.id, context)
  }

  setup(documentId: any, context?: any) {
    this.dispose()

    if (this.props.urlParams.rev) {
      if (historyIsEnabled()) {
        this.handleFetchHistoricalDocument()
      } else {
        this.handleCloseHistory(context)
      }
    }
  }

  getActiveViewId() {
    const views = this.props.views
    return this.context.params.view || (views[0] && views[0].id)
  }

  getPublishedId() {
    return getPublishedId(this.props.options.id)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.options.id !== this.props.options.id) {
      this.setup(this.props.options.id)
    }

    this.handleHistoryTransition(prevProps, prevState)
  }

  handleHistoryTransition(prevProps: Props, prevState: State) {
    const next = this.props.urlParams
    const prev = prevProps.urlParams
    const selectedRev = next.rev
    const revChanged = next.rev !== prev.rev
    const {rev, ...params} = next
    const historyEvents = this.state.historyState.events
    const historicalSnapshot = this.state.historical.snapshot
    const isLoadingSnapshot = this.state.historical.isLoading
    const shouldLoadHistoricalSnapshot =
      revChanged || (!isLoadingSnapshot && selectedRev && !historicalSnapshot)
    const shouldLoadHistory = Boolean(historyEvents.length === 0 && selectedRev)

    if (prevState.historyState.isEnabled && !this.state.historyState.isEnabled) {
      this.handleCloseHistory()
    }

    if (shouldLoadHistory) {
      debugHistory('Fetch history events')
      this.handleFetchHistoryEvents()
    }

    // A new revision was selected, and we're not currently loading the snapshot
    if (shouldLoadHistoricalSnapshot) {
      this.handleFetchHistoricalDocument(rev)
    }

    // Transitioned to a different document
    if (rev && prevProps.options.id !== this.props.options.id) {
      debugHistory('Document ID changed, remove revision from URL')
      // Tear out the revision from the URL, as well as the selected revision
      this.context.setParams(params, {recurseIfInherited: true})
      return
    }

    // History was closed
    if (!rev && prev.rev) {
      debugHistory('History closed, reset history state')
      this.setHistoryState(INITIAL_HISTORY_STATE)
      this.setState({historical: INITIAL_HISTORICAL_DOCUMENT_STATE})
    }
  }

  handleFetchHistoricalDocument(atRev?: any) {
    const isCurrent = atRev === CURRENT_REVISION_FLAG
    if (isCurrent) {
      return
    }

    const event = atRev ? this.findHistoryEventByRev(atRev) : this.findSelectedHistoryEvent()
    if (!event) {
      debugHistory(
        'Could not find history event %s',
        atRev ? `for revision ${atRev}` : ' (selected)'
      )
      return
    }

    if (this._historyFetchDocSubscription) {
      this._historyFetchDocSubscription.unsubscribe()
    }

    this.setState(({historical}) => ({
      historical: {
        ...historical,
        snapshot: null,
        prevSnapshot: historical.snapshot || historical.prevSnapshot,
        isLoading: true
      }
    }))

    const {displayDocumentId: id, rev} = event

    debugHistory('Fetch historical document for rev %s', atRev)
    this._historyFetchDocSubscription = from(historyStore.getDocumentAtRevision(id, rev)).subscribe(
      (newSnapshot: any) => {
        this.setState(({historical}) => ({
          historical: {...historical, isLoading: false, snapshot: newSnapshot, prevSnapshot: null}
        }))
      }
    )
  }

  handleHistorySelect = (event: any) => {
    const paneContext = this.context

    const eventisCurrent = this.state.history.events[0] === event

    paneContext.setParams(
      {...paneContext.params, rev: eventisCurrent ? CURRENT_REVISION_FLAG : event.rev},
      {recurseIfInherited: true}
    )
  }

  handleSplitPane = () => {
    this.context.duplicateCurrent()
  }

  handleSetActiveView = (...args: any[]) => {
    this.context.setView(...args)
  }

  handleClosePane = () => {
    this.context.closeCurrent()
  }

  getInitialValue() {
    const {value} = this.props
    const typeName = this.props.options.type
    const base = {_type: typeName}
    return value ? base : {...base, ...this.props.initialValue}
  }

  canShowHistoryList() {
    return (
      this.context.siblingIndex === 0 &&
      !this.props.isCollapsed &&
      this.state.historyState.isEnabled
    )
  }

  canShowChangesList() {
    // console.log(this.context)
    // TODO: make it possible to find out if this pane is the last sibling in a group

    return (
      this.context.siblingIndex === 0 &&
      !this.props.isCollapsed &&
      this.state.historyState.isEnabled
    )
  }

  componentDidMount() {
    this._isMounted = true

    this.resizeSubscriber = windowWidth$.subscribe(() => {
      const historyEnabled = historyIsEnabled()
      const hasNarrowScreen = isNarrowScreen()
      if (this.state.historyState.isEnabled !== historyEnabled) {
        this.setHistoryState({isEnabled: historyEnabled})
      }

      if (this.state.hasNarrowScreen !== hasNarrowScreen) {
        this.setState({hasNarrowScreen})
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false

    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe()
    }

    this.dispose()
  }

  isLiveEditEnabled() {
    const selectedSchemaType = schema.get(this.props.options.type)
    return selectedSchemaType.liveEdit === true
  }

  historyIsOpen() {
    return Boolean(this.props.urlParams.rev)
  }

  dispose() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = undefined
    }

    if (this._historyEventsSubscription) {
      this._historyEventsSubscription.unsubscribe()
    }

    if (this._historyFetchDocSubscription) {
      this._historyFetchDocSubscription.unsubscribe()
    }
  }

  handleToggleInspect = () => {
    const {value} = this.props
    if (!value) {
      return
    }

    this.setState(prevState => ({inspect: !prevState.inspect}))
  }

  handleKeyUp = (event: any) => {
    if (event.keyCode === 'Escape' && this.state.showValidationTooltip) {
      return this.setState({showValidationTooltip: false})
    }

    if (isInspectHotkey(event) && !this.historyIsOpen()) {
      return this.handleToggleInspect()
    }

    if (isPreviewHotkey(event)) {
      //todo
      const {draft, published} = this.props
      const item = getProductionPreviewItem({draft, published})
      return item && item.url && window.open(item.url)
    }

    return null
  }

  handleHideInspector = () => {
    this.setState({inspect: false})
  }

  handleMenuAction = (item: any) => {
    if (item.action === 'production-preview') {
      window.open(item.url)
      return true
    }

    if (item.action === 'inspect') {
      this.setState({inspect: true})
      return true
    }

    if (item.action === 'browseHistory') {
      this.handleOpenHistory()
      return true
    }

    this.setState({isMenuOpen: false})
    return false
  }

  handleCloseValidationResults = () => {
    this.setState({showValidationTooltip: false})
  }

  handleToggleValidationResults = () => {
    this.setState(prevState => ({showValidationTooltip: !prevState.showValidationTooltip}))
  }

  setHistoryState = (nextHistoryState: any, cb = noop) => {
    this.setState(
      ({historyState: currentHistoryState}) => ({
        historyState: {...currentHistoryState, ...nextHistoryState}
      }),
      cb
    )
  }

  handleFetchHistoryEvents() {
    const {options} = this.props

    if (this._historyEventsSubscription) {
      this._historyEventsSubscription.unsubscribe()
    }

    this._historyEventsSubscription = historyStore
      .historyEventsFor(getPublishedId(options.id))
      .pipe(
        map(events => {
          this.setHistoryState({events, isLoading: false})
          return events
        })
      )
      .subscribe()
  }

  handleOpenHistory = () => {
    if (!this.canShowHistoryList() || this.historyIsOpen()) {
      return
    }

    this.context.setParams(
      {...this.context.params, rev: CURRENT_REVISION_FLAG},
      {recurseIfInherited: true}
    )
  }

  handleCloseHistory = (ctx?: any) => {
    const context = this.context || ctx
    if (this._historyEventsSubscription) {
      this._historyEventsSubscription.unsubscribe()
    }

    const {rev, ...params} = context.params
    if (rev) {
      // If there is a revision in the URL, remove it and let componentDidUpdate handle closing transition
      context.setParams(params, {recurseIfInherited: true})
    }
  }

  handleMenuToggle = (evt: any) => {
    evt.stopPropagation()
    this.setState(prevState => ({isMenuOpen: !prevState.isMenuOpen}))
  }

  handleEditAsActualType = () => {
    const paneContext = this.context
    const {value} = this.props
    if (!value) {
      throw new Error("Can't navigate to unknown document")
    }
    paneContext.navigateIntent('edit', {
      id: getPublishedId(value._id),
      type: value._type
    })
  }

  handleSetFocus = (path: any) => {
    if (this.formRef.current) {
      this.formRef.current.handleFocus(path)
    }
  }

  getTitle(value: any) {
    const {title: paneTitle, options} = this.props
    const typeName = options.type
    const type = schema.get(typeName)
    if (paneTitle) {
      return <span>{paneTitle}</span>
    }

    if (this.historyIsOpen()) {
      return (
        <>
          History of{' '}
          <PreviewFields document={value} type={type} fields={['title']}>
            {({title}) => (title ? <em>{title}</em> : <em>Untitled</em>)}
          </PreviewFields>
        </>
      )
    }

    if (!value) {
      return `New ${type.title || type.name}`
    }

    return (
      <PreviewFields document={value} type={type} fields={['title']}>
        {({title}) => (title ? <span>{title}</span> : <em>Untitled</em>)}
      </PreviewFields>
    )
  }

  findSelectedHistoryEvent() {
    const selectedRev = this.props.urlParams.rev
    return this.findHistoryEventByRev(selectedRev)
  }

  findHistoryEventByRev(rev: any) {
    const {events} = this.state.historyState
    return rev === CURRENT_REVISION_FLAG
      ? events[0]
      : events.find(event => event.rev === rev || event.transactionIds.includes(rev))
  }

  render() {
    const {
      isSelected,
      isCollapsed,
      isClosable,
      markers,
      menuItemGroups,
      onChange,
      onCollapse,
      connectionState,
      onExpand,
      options,
      paneKey,
      urlParams,
      value,
      views
    } = this.props

    const typeName = options.type
    const schemaType = schema.get(typeName)

    if (!schemaType) {
      return (
        <ErrorPane
          {...this.props}
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
          {!typeName && (
            <p>This document does not exist, and no schema type was specified for it.</p>
          )}
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
      return <LoadingPane {...this.props} delay={600} message={`Loading ${schemaType.title}…`} />
    }

    const {hasNarrowScreen, historical, historyState, inspect, showValidationTooltip} = this.state
    const initialValue = this.getInitialValue()
    const activeViewId = this.getActiveViewId()
    const selectedHistoryEvent = this.findSelectedHistoryEvent()
    const menuItems = getMenuItems({
      value,
      isLiveEditEnabled: this.isLiveEditEnabled(),
      revision: selectedHistoryEvent && selectedHistoryEvent._rev,
      canShowHistoryList: this.canShowHistoryList()
    })

    const isHistoryOpen = this.historyIsOpen()
    const selectedIsLatest =
      urlParams.rev === CURRENT_REVISION_FLAG && selectedHistoryEvent === historyState.events[0]

    return (
      <DocumentActionShortcuts
        id={options.id}
        type={typeName}
        onKeyUp={this.handleKeyUp}
        className={isHistoryOpen ? styles.withHistoryMode : styles.root}
      >
        {isHistoryOpen && this.canShowHistoryList() && (
          <div className={styles.navigatorContainer}>
            <HistoryNavigator
              key="history"
              documentId={getPublishedId(options.id)}
              onItemSelect={this.handleHistorySelect}
              lastEdited={value && new Date(value._updatedAt)}
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
            formRef={this.formRef}
            hasSiblings={this.context.hasGroupSiblings}
            historical={historical}
            historyState={historyState}
            initialValue={initialValue}
            inspect={inspect}
            isClosable={isClosable}
            isCollapsed={isCollapsed}
            isHistoryOpen={isHistoryOpen}
            isSelected={isSelected}
            menuItemGroups={menuItemGroups}
            menuItems={menuItems}
            onAction={this.handleMenuAction}
            onChange={onChange}
            onCloseValidationResults={this.handleCloseValidationResults}
            onCloseView={this.handleClosePane}
            onCollapse={onCollapse}
            onExpand={onExpand}
            onHideInspector={this.handleHideInspector}
            onOpenHistory={this.handleOpenHistory}
            onSetActiveView={this.handleSetActiveView}
            onSetFocus={this.handleSetFocus}
            onSplitPane={hasNarrowScreen ? undefined : this.handleSplitPane}
            onToggleValidationResults={this.handleToggleValidationResults}
            options={options}
            markers={markers}
            paneKey={paneKey}
            publishedId={this.getPublishedId()}
            selectedHistoryEvent={selectedHistoryEvent}
            selectedIsLatest={selectedIsLatest}
            showValidationTooltip={showValidationTooltip}
            title={this.getTitle(value)}
            value={value}
            views={views}
          />
        </div>

        {isHistoryOpen && this.canShowChangesList() && (
          <div className={styles.inspectorContainer}>
            <ChangesInspector onHistoryClose={this.handleCloseHistory} />
          </div>
        )}
      </DocumentActionShortcuts>
    )
  }
}
