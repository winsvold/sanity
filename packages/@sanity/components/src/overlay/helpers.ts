import {OverlayScrollRect, OverlayRegionRect} from './types'

export function getElementScroll(element: Element) {
  return {
    left: element.scrollLeft,
    top: element.scrollTop
  }
}

export function getWindowScroll() {
  return {
    left: window.scrollX,
    top: window.scrollY
  }
}

export function getRect(element: Element, scroll: OverlayScrollRect): OverlayRegionRect {
  const rect = element.getBoundingClientRect()

  return {
    top: rect.top + scroll.top,
    left: rect.left + scroll.left,
    right: rect.right + scroll.left,
    bottom: rect.bottom + scroll.top,
    width: rect.width,
    height: rect.height
  }
}
