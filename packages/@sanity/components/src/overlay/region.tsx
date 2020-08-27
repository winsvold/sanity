import React, {useEffect, useRef} from 'react'
import {useOverlay} from './hooks'
import {OverlayRegionParams} from './types'

interface OverlayRegionProps {
  children: React.ReactNode
  id: string
  params: OverlayRegionParams
}

export function OverlayRegion(props: OverlayRegionProps) {
  const {children, id, params, ...restProps} = props
  const {observe, setParams, unobserve} = useOverlay()
  const ref = useRef()

  if (!id) {
    throw new Error('Missing `id` property')
  }

  useEffect(() => {
    const element = ref.current

    observe(id, element)

    return () => {
      unobserve(id, element)
    }
  }, [observe, unobserve, id])

  useEffect(() => {
    setParams(id, params)
  }, [setParams, id, params])

  return (
    <div {...restProps} data-c="region" data-id={id} ref={ref}>
      {children}
    </div>
  )
}
