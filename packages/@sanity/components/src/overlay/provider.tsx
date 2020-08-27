import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {getRect, getElementScroll, getWindowScroll} from './helpers'
import {OverlayContext} from './context'
import {
  OverlayRegionIntersection,
  OverlayRegionObserver,
  OverlayRegionInterface,
  OverlayRegionParams,
  OverlayRegionRect
} from './types'

interface OverlayProviderProps {
  children: (
    scrollRef: React.MutableRefObject<Element>,
    wrapperRef: React.MutableRefObject<Element>
  ) => React.ReactNode
  // eslint-disable-next-line react/require-default-props
  onChange?: (regions: OverlayRegionInterface[]) => void
  // eslint-disable-next-line react/require-default-props
  rootMargin?: string
  // wrapperRef: React.RefObject<Element>
  // scrollRef: React.RefObject<Element>
}

const MUTATION_OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
}

export const OverlayProvider = React.memo((props: OverlayProviderProps) => {
  const {
    children,
    onChange,
    rootMargin = '0px'
    // wrapperRef,
    // scrollRef
  } = props

  const scrollRef = useRef<Element | null>(null)
  const wrapperRef = useRef<Element | null>(null)

  // if (!wrapperRef) {
  //   throw new Error('OverlayProvider: missing `wrapperRef` property')
  // }

  // if (!scrollRef) {
  //   throw new Error('OverlayProvider: missing `scrollRef` property')
  // }

  const [rect, setRect] = useState({width: 0, height: 0})
  const [ids, setIds] = useState<string[]>([])
  const rootRectRef = useRef(null)
  const intersectionsRef = useRef<{[key: string]: OverlayRegionIntersection}>({})
  const rectsRef = useRef<{[key: string]: OverlayRegionRect}>({})
  const paramsRef = useRef<{[key: string]: OverlayRegionParams}>({})
  const observerMap = useRef<{[key: string]: OverlayRegionObserver}>({})
  const idMap = useMemo(() => new WeakMap(), [])
  const regions = useMemo(() => {
    return ids.map(id => ({
      id,
      rect: rectsRef.current[id],
      intersection: intersectionsRef.current[id],
      params: paramsRef.current[id]
    }))
  }, [ids])

  // Keep references to observers
  const ioRef = useRef(null)
  const roRef = useRef(null)
  const moRef = useRef(null)

  // Create `observe` callback
  const observe = useCallback(
    (id: string, element: Element) => {
      idMap.set(element, id)

      observerMap.current[id] = {id, element}

      if (ioRef.current) ioRef.current.observe(element)
      if (roRef.current) roRef.current.observe(element)

      setIds(val => val.concat([id]))
    },
    [idMap]
  )

  const setParams = useCallback((id: string, params: OverlayRegionParams) => {
    paramsRef.current[id] = params

    // trigger update
    setIds(val => val.slice(0))
  }, [])

  // Create `unobserve` callback
  const unobserve = useCallback((id: string, element: Element) => {
    // if (observerMap.current) {
    if (ioRef.current) ioRef.current.unobserve(element)
    if (roRef.current) roRef.current.unobserve(element)

    delete observerMap.current[id]
    delete intersectionsRef.current[id]
    delete rectsRef.current[id]
    delete paramsRef.current[id]

    // eslint-disable-next-line max-nested-callbacks
    setIds(val => val.filter(k => k !== id))
    // }
  }, [])

  // Setup observerMap
  useEffect(() => {
    const rootElement = wrapperRef.current

    rootRectRef.current = getRect(
      rootElement,
      scrollRef.current ? getElementScroll(scrollRef.current) : getWindowScroll()
    )

    const updateRects = () => {
      // if (!observerMap.current) return

      rootRectRef.current = getRect(
        rootElement,
        scrollRef.current ? getElementScroll(scrollRef.current) : getWindowScroll()
      )

      setRect({width: rootRectRef.current.width, height: rootRectRef.current.height})

      const observers = Object.values(observerMap.current)

      let changed = false

      observers.forEach(observer => {
        const currRect = rectsRef.current[observer.id] || {top: -1, left: -1, width: -1, height: -1}
        const rootRect = rootRectRef.current
        const _rect = getRect(
          observer.element,
          scrollRef.current ? getElementScroll(scrollRef.current) : getWindowScroll()
        )

        const top = _rect.top - rootRect.top
        const left = _rect.left - rootRect.left
        const bottom = _rect.bottom - rootRect.top
        const right = _rect.right - rootRect.left
        const width = _rect.width
        const height = _rect.height

        if (
          currRect.top !== top ||
          currRect.left !== left ||
          currRect.width !== width ||
          currRect.height !== height
        ) {
          rectsRef.current[observer.id] = {
            top,
            left,
            width,
            height,
            bottom,
            right
          }

          changed = true
        }
      })

      if (changed) {
        // trigger update
        setIds(val => val.slice(0))
      }
    }

    // intersect
    const handleIntersect: IntersectionObserverCallback = entries => {
      // if (!observerMap.current) return

      entries.forEach(entry => {
        const id = idMap.get(entry.target)
        const observer = id && observerMap.current[id]

        if (observer) {
          intersectionsRef.current[observer.id] = {
            isAbove: entry.boundingClientRect.top < entry.rootBounds.top,
            isBelow: entry.boundingClientRect.bottom > entry.rootBounds.bottom,
            isVisible: !(
              entry.boundingClientRect.bottom < entry.rootBounds.top ||
              entry.boundingClientRect.top > entry.rootBounds.bottom
            )
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn(`IntersectionObserver: no observer found for element`, entry.target)
        }
      })

      // trigger update
      setIds(val => val.slice(0))
    }

    ioRef.current = new IntersectionObserver(handleIntersect, {
      root: ((scrollRef && scrollRef.current) || window) as any,
      rootMargin,
      threshold: [0, 1]
    })

    Object.values(observerMap.current).forEach(observer => ioRef.current.observe(observer.element))

    // resize
    roRef.current = new ResizeObserver(updateRects)
    roRef.current.observe(rootElement)
    Object.values(observerMap.current).forEach(observer => roRef.current.observe(observer.element))

    // mutate
    moRef.current = new MutationObserver(updateRects)
    moRef.current.observe(rootElement, MUTATION_OBSERVER_CONFIG)

    return () => {
      if (ioRef) {
        ioRef.current.disconnect()
        ioRef.current = null
      }

      if (roRef) {
        roRef.current.disconnect()
        roRef.current = null
      }

      if (moRef) {
        moRef.current.disconnect()
        moRef.current = null
      }
    }
  }, [idMap, rootMargin])

  useEffect(() => {
    if (onChange) onChange(regions)
  }, [onChange, regions])

  return (
    <OverlayContext.Provider value={{observe, rect, regions, setParams, unobserve}}>
      {children(scrollRef, wrapperRef)}
    </OverlayContext.Provider>
  )
})
