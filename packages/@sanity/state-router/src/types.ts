export type Segment = {
  name: string
  type: 'dir' | 'param'
}

export type RouteState = Record<string, any>

export type Transform<T = RouteState> = {
  toState: (value: string) => T
  toPath: (value: T) => string
}

export type Route = {
  raw: string
  segments: Segment[]
  transform?: {
    [key: string]: Transform
  }
}

export type RouteChildren = Node[] | ((state: RouteState) => Node[])

export type Node = {
  route: Route
  scope?: string
  transform?: {
    [key: string]: Transform
  }
  children: RouteChildren
}

export type Router = Node & {
  _isRoute: boolean
  encode: (state: RouteState) => string
  decode: (path: string) => RouteState | null
  isNotFound: (path: string) => boolean
  getBasePath: () => string
  getRedirectBase: (pathname: string) => string | null
  isRoot: (path: string) => boolean
}

export type MatchResult = {
  nodes: Node[]
  missing: string[]
  remaining: string[]
}
