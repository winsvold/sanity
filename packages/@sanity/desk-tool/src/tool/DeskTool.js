import isHotkey from 'is-hotkey'
import React, {useEffect, useRef, useState} from 'react'
// import PropTypes from 'prop-types'
import {isEqual} from 'lodash'
import {interval, of} from 'rxjs'
import {map, switchMap, distinctUntilChanged, debounce} from 'rxjs/operators'
import shallowEquals from 'shallow-equals'
import {useRouter, useRouterState} from 'part:@sanity/base/router'
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
import DeskToolPanes from './DeskToolPanes'

const EMPTY_PANE_KEYS = []

const hasLoading = panes => panes.some(item => item === LOADING_PANE)

const isSaveHotkey = isHotkey('mod+s')

function DeskTool(props) {
  const {onPaneChange} = props
  const router = useRouter()
  const routerState = useRouterState()
  // static contextTypes = {
  //   addToSnackQueue: PropTypes.func
  // }

  // static propTypes = {
  //   // router: PropTypes.shape({
  //   //   navigate: PropTypes.func.isRequired,
  //   //   state: PropTypes.shape({
  //   //     panes: PropTypes.arrayOf(
  //   //       PropTypes.arrayOf(
  //   //         PropTypes.shape({
  //   //           id: PropTypes.string.isRequired,
  //   //           params: PropTypes.object
  //   //         })
  //   //       )
  //   //     ),
  //   //     params: PropTypes.shape({
  //   //       template: PropTypes.string
  //   //     }),
  //   //     editDocumentId: PropTypes.string,
  //   //     legacyEditDocumentId: PropTypes.string,
  //   //     type: PropTypes.string,
  //   //     action: PropTypes.string
  //   //   })
  //   // }).isRequired,
  //   onPaneChange: PropTypes.func.isRequired
  // }

  const [state, setState] = useState({
    isResolving: true,
    hasNarrowScreen: isNarrowScreen(),
    panes: []
  })

  // constructor(props) {
  //   super(props)

  //   onPaneChange([])
  // }

  const setResolvedPanes = panes => {
    // const router = router
    const paneSegments = routerState.panes || []

    setState({panes, isResolving: false})

    if (panes.length < paneSegments.length) {
      router.navigate({...routerState, panes: paneSegments.slice(0, panes.length)}, {replace: true})
    }
  }

  const setResolveError = error => {
    setStructureResolveError(error)

    // Log error for proper stacktraces
    console.error(error) // eslint-disable-line no-console

    setState({error, isResolving: false})
  }

  const derivePanes = (props, fromIndex = [0, 0]) => {
    if (paneDeriver) {
      paneDeriver.unsubscribe()
    }

    setState({isResolving: true})
    paneDeriver = loadStructure()
      .pipe(
        distinctUntilChanged(),
        map(maybeSerialize),
        switchMap(structure =>
          resolvePanes(structure, routerState.panes || [], state.panes, fromIndex)
        ),
        switchMap(panes =>
          hasLoading(panes) ? of(panes).pipe(debounce(() => interval(50))) : of(panes)
        )
      )
      .subscribe(setResolvedPanes, setResolveError)
  }

  const panesAreEqual = (prev, next) => calculatePanesEquality(prev, next).ids

  const shouldDerivePanes = (nextProps, prevProps) => {
    const nextRouterState = nextProps.routerState
    const prevRouterState = prevProps.routerState

    return (
      !panesAreEqual(prevRouterState.panes, nextRouterState.panes) ||
      nextRouterState.legacyEditDocumentId !== prevRouterState.legacyEditDocumentId ||
      nextRouterState.type !== prevRouterState.type ||
      nextRouterState.action !== prevRouterState.action
    )
  }

  const onPaneChangeRef = useRef(onPaneChange)
  const panesRef = useRef(panes)

  // componentDidUpdate(prevProps, prevState) {
  useEffect(() => {
    if (onPaneChangeRef.current !== onPaneChange || panesRef.current !== state.panes) {
      onPaneChange(state.panes || [])
    }

    //   const prevPanes = prevProps.routerState.panes || []
    //   const nextPanes = routerState.panes || []
    //   const panesEqual = calculatePanesEquality(prevPanes, nextPanes)

    //   if (!panesEqual.ids && shouldDerivePanes(props, prevProps)) {
    //     const diffAt = getPaneDiffIndex(nextPanes, prevPanes)

    //     if (diffAt) {
    //       derivePanes(diffAt)
    //     }
    //   }
  }, [onPaneChange, panes])

  // shouldComponentUpdate(nextProps, nextState) {
  //   const {router: oldRouter, ...oldProps} = props
  //   const {router: newRouter, ...newProps} = nextProps
  //   const {panes: oldPanes, ...oldState} = state
  //   const {panes: newPanes, ...newState} = nextState
  //   const prevPanes = oldRouter.state.panes || []
  //   const nextPanes = newRouter.state.panes || []
  //   const panesEqual = calculatePanesEquality(prevPanes, nextPanes)

  //   const shouldUpdate =
  //     !panesEqual.params ||
  //     !panesEqual.ids ||
  //     !shallowEquals(oldProps, newProps) ||
  //     !isEqual(oldPanes, newPanes) ||
  //     !shallowEquals(oldState, newState)

  //   return shouldUpdate
  // }

  const maybeHandleOldUrl = () => {
    const {navigate} = router
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

  const maybeCutSiblingPanes = () => {
    const {hasNarrowScreen} = state
    if (!hasNarrowScreen) {
      return
    }

    const {navigate} = router
    const panes = routerState.panes || []
    const hasSiblings = panes.some(group => group.length > 1)
    if (!hasSiblings) {
      return
    }

    const withoutSiblings = panes.map(group => [group[0]])
    navigate({panes: withoutSiblings}, {replace: true})
  }

  useEffect(() => {
    const sub = windowWidth$.subscribe(() => {
      const hasNarrowScreen = isNarrowScreen()
      if (state.hasNarrowScreen !== hasNarrowScreen) {
        setState({hasNarrowScreen: isNarrowScreen()}, maybeCutSiblingPanes)
      }
    })

    maybeCutSiblingPanes()
    maybeHandleOldUrl()
    derivePanes(props)
    onPaneChange(state.panes || [])

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      // @todo
    }
  }, [])

  // componentWillUnmount() {
  //   if (paneDeriver) {
  //     paneDeriver.unsubscribe()
  //   }

  //   if (resizeSubscriber) {
  //     resizeSubscriber.unsubscribe()
  //   }

  //   window.removeEventListener('keydown', handleGlobalKeyDown)
  // }

  const handleGlobalKeyDown = event => {
    // Prevent `Cmd+S`
    if (isSaveHotkey(event)) {
      event.preventDefault()

      context.addToSnackQueue({
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

  // render() {
  // const {router} = props
  const {panes, error} = state
  if (error) {
    return <StructureError error={error} />
  }

  const keys =
    (routerState.panes || []).reduce(
      (ids, group) => ids.concat(group.map(sibling => sibling.id)),
      []
    ) || EMPTY_PANE_KEYS

  const groupIndexes = (routerState.panes || []).reduce(
    (ids, group) => ids.concat(group.map((sibling, groupIndex) => groupIndex)),
    []
  )

  if (!panes) {
    return null
  }

  return (
    <DeskToolPanes
      router={router}
      panes={state.panes}
      keys={keys}
      groupIndexes={groupIndexes}
      autoCollapse
    />
  )
}
// )

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
