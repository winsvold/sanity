import isHotkey from 'is-hotkey'
import React from 'react'
import {isEqual} from 'lodash'
import {interval, of, Subscription} from 'rxjs'
import {map, switchMap, distinctUntilChanged, debounce} from 'rxjs/operators'
import shallowEquals from 'shallow-equals'
import {withRouterHOC} from 'part:@sanity/base/router'
import {getTemplateById} from '@sanity/base/initial-value-templates'
import {
  resolvePanes,
  loadStructure,
  maybeSerialize,
  setStructureResolveError
} from '../utils/resolvePanes'
import StructureError from '../components/StructureError'
import {calculatePanesEquality} from '../utils/calculatePanesEquality'
import isNarrowScreen from '../utils/isNarrowScreen'
import windowWidth$ from '../utils/windowWidth'
import {LOADING_PANE} from '../constants'
import {RouterNavigateFn} from '../types'
import DeskToolPanes from './DeskToolPanes'

const EMPTY_PANE_KEYS = []

const hasLoading = panes => panes.some(item => item === LOADING_PANE)

const isSaveHotkey = isHotkey('mod+s')

interface DeskToolProps {
  router: {
    navigate: RouterNavigateFn
    state?: {
      panes?: {
        id: string
        params?: Record<string, any>
      }[][]
      params?: {
        template?: string
      }
      editDocumentId?: string
      legacyEditDocumentId?: string
      type?: string
      action?: string
    }
  }
  onPaneChange: () => void
}

interface State {
  error?: Error | null
  // isResolving: boolean
  hasNarrowScreen: boolean
  panes: null
}

export default withRouterHOC(
  // eslint-disable-next-line react/prefer-stateless-function
  class DeskTool extends React.Component<DeskToolProps, State> {
    // static contextTypes = {
    //   addToSnackQueue: func
    // }

    state: State = {
      // isResolving: true,
      hasNarrowScreen: isNarrowScreen(),
      panes: null
    }

    // @todo: typings
    paneDeriver?: any

    resizeSubscriber?: Subscription

    constructor(props) {
      super(props)

      props.onPaneChange([])
    }

    setResolvedPanes = panes => {
      const router = this.props.router
      const paneSegments = router.state?.panes || []

      this.setState({
        panes
        // isResolving: false
      })

      if (panes.length < paneSegments.length) {
        router.navigate(
          {...(router.state || {}), panes: paneSegments.slice(0, panes.length)},
          {replace: true}
        )
      }
    }

    setResolveError = (error: Error) => {
      setStructureResolveError(error)

      // Log error for proper stacktraces
      console.error(error) // eslint-disable-line no-console

      this.setState({
        error
        // isResolving: false
      })
    }

    derivePanes(props, fromIndex = [0, 0]) {
      if (this.paneDeriver) {
        this.paneDeriver.unsubscribe()
      }

      // this.setState({isResolving: true})

      this.paneDeriver = loadStructure()
        .pipe(
          distinctUntilChanged(),
          map(maybeSerialize),
          switchMap(structure =>
            resolvePanes(structure, props.router.state?.panes || [], this.state.panes, fromIndex)
          ),
          switchMap(panes =>
            hasLoading(panes) ? of(panes).pipe(debounce(() => interval(50))) : of(panes)
          )
        )
        .subscribe(this.setResolvedPanes, this.setResolveError)
    }

    panesAreEqual = (prev, next) => calculatePanesEquality(prev, next).ids

    shouldDerivePanes = (nextProps: DeskToolProps, prevProps: DeskToolProps) => {
      const nextRouterState = nextProps.router.state || {}
      const prevRouterState = prevProps.router.state || {}

      return (
        !this.panesAreEqual(prevRouterState.panes, nextRouterState.panes) ||
        nextRouterState.legacyEditDocumentId !== prevRouterState.legacyEditDocumentId ||
        nextRouterState.type !== prevRouterState.type ||
        nextRouterState.action !== prevRouterState.action
      )
    }

    componentDidUpdate(prevProps: DeskToolProps, prevState: State) {
      if (
        prevProps.onPaneChange !== this.props.onPaneChange ||
        prevState.panes !== this.state.panes
      ) {
        this.props.onPaneChange(this.state.panes || [])
      }

      const prevPanes = prevProps.router.state?.panes || []
      const nextPanes = this.props.router.state?.panes || []
      const panesEqual = calculatePanesEquality(prevPanes, nextPanes)

      if (!panesEqual.ids && this.shouldDerivePanes(this.props, prevProps)) {
        const diffAt = getPaneDiffIndex(nextPanes, prevPanes)

        if (diffAt) {
          this.derivePanes(this.props, diffAt)
        }
      }
    }

    shouldComponentUpdate(nextProps: DeskToolProps, nextState: State) {
      const {router: oldRouter, ...oldProps} = this.props
      const {router: newRouter, ...newProps} = nextProps
      const {panes: oldPanes, ...oldState} = this.state
      const {panes: newPanes, ...newState} = nextState
      const prevPanes = oldRouter.state?.panes || []
      const nextPanes = newRouter.state?.panes || []
      const panesEqual = calculatePanesEquality(prevPanes, nextPanes)

      const shouldUpdate =
        !panesEqual.params ||
        !panesEqual.ids ||
        !shallowEquals(oldProps, newProps) ||
        !isEqual(oldPanes, newPanes) ||
        !shallowEquals(oldState, newState)

      return shouldUpdate
    }

    maybeHandleOldUrl() {
      const {navigate} = this.props.router
      const routerState = this.props.router.state || {}
      const {
        action,
        legacyEditDocumentId,
        type: schemaType,
        editDocumentId,
        params = {}
      } = routerState

      const {template: templateName, ...payloadParams} = params
      const template = getTemplateById(templateName)
      const type = (template && template.schemaType) || schemaType
      const shouldRewrite = (action === 'edit' && legacyEditDocumentId) || (type && editDocumentId)
      if (!shouldRewrite) {
        return
      }

      navigate(
        getIntentRouteParams({
          id: editDocumentId || legacyEditDocumentId,
          type,
          payloadParams,
          templateName
        }),
        {replace: true}
      )
    }

    maybeCutSiblingPanes() {
      const {hasNarrowScreen} = this.state
      if (!hasNarrowScreen) {
        return
      }

      const {navigate} = this.props.router
      const panes = this.props.router.state?.panes || []
      const hasSiblings = panes.some(group => group.length > 1)
      if (!hasSiblings) {
        return
      }

      const withoutSiblings = panes.map(group => [group[0]])
      navigate({panes: withoutSiblings}, {replace: true})
    }

    componentDidMount() {
      this.resizeSubscriber = windowWidth$.subscribe(() => {
        const hasNarrowScreen = isNarrowScreen()
        if (this.state.hasNarrowScreen !== hasNarrowScreen) {
          this.setState({hasNarrowScreen: isNarrowScreen()}, this.maybeCutSiblingPanes)
        }
      })

      this.maybeCutSiblingPanes()
      this.maybeHandleOldUrl()
      this.derivePanes(this.props)
      this.props.onPaneChange(this.state.panes || [])

      window.addEventListener('keydown', this.handleGlobalKeyDown)
    }

    componentWillUnmount() {
      if (this.paneDeriver) {
        this.paneDeriver.unsubscribe()
      }

      if (this.resizeSubscriber) {
        this.resizeSubscriber.unsubscribe()
      }

      window.removeEventListener('keydown', this.handleGlobalKeyDown)
    }

    handleGlobalKeyDown = event => {
      // Prevent `Cmd+S`
      if (isSaveHotkey(event)) {
        event.preventDefault()

        this.context.addToSnackQueue({
          id: 'auto-save-message',
          isOpen: true,
          setFocus: false,
          kind: 'info',
          title: 'Sanity auto-saves your work!',
          autoDismissTimeout: 4000,
          isCloseable: true
        })
      }
    }

    render() {
      const {router} = this.props
      const {panes, error} = this.state
      if (error) {
        return <StructureError error={error} />
      }

      const keys =
        (router.state?.panes || []).reduce(
          (ids, group) => ids.concat(group.map(sibling => sibling.id)),
          []
        ) || EMPTY_PANE_KEYS

      const groupIndexes = (router.state?.panes || []).reduce(
        (ids, group) => ids.concat(group.map((sibling, groupIndex) => groupIndex)),
        []
      )

      if (!panes) {
        return null
      }

      return (
        <DeskToolPanes
          router={router}
          panes={this.state.panes}
          keys={keys}
          groupIndexes={groupIndexes}
          autoCollapse
        />
      )
    }
  }
)

function getPaneDiffIndex(nextPanes, prevPanes) {
  if (!nextPanes.length) {
    return [0, 0]
  }

  const maxPanes = Math.max(nextPanes.length, prevPanes.length)
  for (let index = 0; index < maxPanes; index++) {
    const nextGroup = nextPanes[index]
    const prevGroup = prevPanes[index]

    // Whole group is now invalid
    if (!prevGroup || !nextGroup) {
      return [index, 0]
    }

    // Less panes than previously? Resolve whole group
    if (prevGroup.length > nextGroup.length) {
      return [index, 0]
    }

    /* eslint-disable max-depth */
    // Iterate over siblings
    for (let splitIndex = 0; splitIndex < nextGroup.length; splitIndex++) {
      const nextSibling = nextGroup[splitIndex]
      const prevSibling = prevGroup[splitIndex]

      // Didn't have a sibling here previously, diff from here!
      if (!prevSibling) {
        return [index, splitIndex]
      }

      // Does the ID differ from the previous?
      if (nextSibling.id !== prevSibling.id) {
        return [index, splitIndex]
      }
    }
    /* eslint-enable max-depth */
  }

  // "No diff"
  return undefined
}

function getIntentRouteParams({id, type, payloadParams, templateName}) {
  return {
    intent: 'edit',
    params: {
      id,
      ...(type ? {type} : {}),
      ...(templateName ? {template: templateName} : {})
    },
    payload: Object.keys(payloadParams).length > 0 ? payloadParams : undefined
  }
}
