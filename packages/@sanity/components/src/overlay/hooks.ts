import {useContext} from 'react'
import {OverlayContext} from './context'

export function useOverlay() {
  const overlay = useContext(OverlayContext)

  if (!overlay) {
    throw new Error('Overlay: missing context value')
  }

  return overlay
}
