export interface OverlayRegionRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface OverlayScrollRect {
  top: number
  left: number
}

export interface OverlayRegionIntersection {
  isAbove: boolean
  isBelow: boolean
  isVisible: boolean
}

export type OverlayRegionParams = Record<string, any>

export interface OverlayRegionInterface {
  id: string
  rect: OverlayRegionRect
  intersection: OverlayRegionIntersection
  params: OverlayRegionParams
}

export interface OverlayRegionObserver {
  element: Element
  id: string
}
