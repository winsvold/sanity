/* eslint-disable react/no-multi-comp, @typescript-eslint/no-empty-function*/
declare module 'part:@sanity/components/*' {
  class SanityInputComponent extends React.Component<any> {
    focus() {}
  }
  export default SanityInputComponent
}

declare module 'part:@sanity/components/click-outside' {
  // export const ClickOutside: ComponentType<{}>
  export const ClickOutside: any
}

declare module 'part:@sanity/components/menu-button' {
  export const MenuButton: ComponentType<{
    // @todo: typings
    buttonProps?: any
    menu?: React.ReactNode
    placement?: string
    open?: boolean
    setOpen?: (val: boolean) => void
  }>
}

declare module 'part:@sanity/components/overlay' {
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
    element: HTMLElement
    id: string
  }
  export const OverlayProvider: ComponentType<{
    children: (
      scrollRef: React.MutableRefObject<Element>,
      wrapperRef: React.MutableRefObject<Element>
    ) => React.ReactNode
    // eslint-disable-next-line react/require-default-props
    onChange?: (regions: OverlayRegionInterface[]) => void
    // eslint-disable-next-line react/require-default-props
    rootMargin?: string
    // rootRef: React.RefObject<Element>
    // scrollRef: React.RefObject<Element>
  }>
  // export const OverlayProvider: any
  export const OverlayRegion: ComponentType<{
    children: React.ReactNode
    id: string
    params: OverlayRegionParams
  }>
  export const useOverlay: () => {
    observe: (id: string, element: Element) => void
    rect: {width: number; height: number}
    regions: OverlayRegionInterface[]
    setParams: (id: string, params: OverlayRegionParams) => void
    unobserve: (id: string, element: Element) => void
  }
  // export const OverlayRegion: any
}

declare module 'part:@sanity/components/popover' {
  // export const Popover: ComponentType<{}>
  export const Popover: any
}

declare module 'part:@sanity/components/tooltip' {
  // export const Tooltip: ComponentType<{}>
  export const Tooltip: any
}

declare module 'part:@sanity/components/selects/*' {
  class SanitySelectComponent extends React.Component<any> {
    focus() {}
  }
  export default SanitySelectComponent
}

declare module 'part:@sanity/components/toggles/*' {
  class SanityToggleComponent extends React.Component<any> {
    focus() {}
  }
  export default SanityToggleComponent
}

declare module 'part:@sanity/components/tags/*' {
  class SanityTagsComponent extends React.Component<any> {
    focus() {}
  }
  export default SanityTagsComponent
}

declare module 'part:@sanity/components/textareas/*' {
  class SanityTextareaComponent extends React.Component<any> {
    focus() {}
  }
  export default SanityTextareaComponent
}

declare module 'config:@sanity/form-builder'
declare module 'all:part:@sanity/form-builder/input/image/asset-source'

declare module 'part:@sanity/components/utilities/portal'
declare module 'part:@sanity/components/lists/*'
declare module 'part:@sanity/*'
