type IntentParameters = Record<string, any> | [Record<string, any>, Record<string, any>]

type NavigateOptions = Record<string, any>

export type RouterNavigateFn = (nextState: Record<string, any>, options?: NavigateOptions) => void

export type RouterNavigateIntentFn = (
  intentName: string,
  params?: IntentParameters,
  options?: NavigateOptions
) => void

export type Router<S = Record<any, any>> = {
  navigate: RouterNavigateFn
  navigateIntent: RouterNavigateIntentFn
  state: S
}

export interface StructureError {
  helpId?: string
  message: string
  path: Array<string | number>
  stack: string
}

export interface ResolvedSchema {
  liveEdit?: boolean
  name: string
  icon?: React.ComponentType
}

export interface PreviewValue {
  _id?: string
  _type?: string
  title?: string
  subtitle?: string
  media: React.ReactNode | React.ComponentType
}

export interface Doc {
  _id?: string
  _type?: string
  _rev?: string
  _updatedAt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
