/* eslint-disable import/export */

// import {Observable} from 'rxjs'
type Observable<T = any> = any

type Schema = {icon?: React.ComponentType; name: string; title: string}

declare module 'sanity:versions' {
  const versions: {[key: string]: string}
  export default versions
}

declare module 'config:sanity' {
  const config: {project: {basePath?: string; name?: string}}
  export const project: {basePath?: string; name?: string}

  export default config
}

declare module 'config:@sanity/default-layout' {
  const defaultLayoutConfig: {
    toolSwitcher?: {
      hidden?: string[]
      order?: string[]
    }
  }
  export default defaultLayoutConfig
}

declare module 'part:@sanity/default-layout/branding-style' {
  const styles: Record<string, string>
  export default styles
}

declare module 'part:@sanity/default-layout/sidecar?' {
  export const isSidecarEnabled: () => boolean | undefined
  export const SidecarLayout: React.ComponentType | undefined
  export const SidecarToggleButton: React.ComponentType | undefined
}

/*
 * @sanity/base
 */

declare module 'part:@sanity/base/app-loading-screen' {
  const AppLoadingScreen: React.ComponentType<{text: React.ReactNode}>
  export default AppLoadingScreen
}

declare module 'all:part:@sanity/base/absolutes' {
  const components: React.ComponentType[]
  export default components
}

declare module 'part:@sanity/base/location' {
  const locationStore: {
    actions: {navigate: (newUrl: string, options: any) => void}
    state: Observable<any>
  }

  export default locationStore
}

declare module 'part:@sanity/base/login-wrapper?' {
  const Component:
    | React.ComponentType<{
        LoadingScreen: React.ReactNode
      }>
    | undefined
  export default Component
}

declare module 'part:@sanity/base/router' {
  export * from '@sanity/base/src/router'
}

declare module 'all:part:@sanity/base/tool' {
  const tools: {
    canHandleIntent?: (intent: any, params: any, state: any) => any
    component?: React.ComponentType
    getIntentState?: (intent: any, params: any, state: any, payload: any) => any
    name: string
    title: string
    router?: any
  }[]
  export default tools
}

declare module 'part:@sanity/base/user' {
  export * from '@sanity/base/src/datastores/user'
  export {default} from '@sanity/base/src/datastores/user'
}

declare module 'part:@sanity/base/settings' {
  const x: {
    forNamespace: (
      key: string
    ) => {
      forKey: (
        k: string
      ) => {
        listen: () => Observable<boolean>
        set: (val: boolean) => void
      }
    }
  }
  export default x
}

declare module 'part:@sanity/base/users-icon' {
  const UserIcon: React.ComponentType
  export default UserIcon
}

declare module 'part:@sanity/base/brand-logo?' {
  const BrandLogo: React.ComponentType | undefined
  export default BrandLogo
}

declare module 'part:@sanity/base/schema' {
  const schema: {
    _validation: {
      path: Array<string | number | {_key: string}>
      problems: {message: string; severity: string}[]
    }[]
    get: (name: string) => Schema
  }
  export default schema
}

declare module 'part:@sanity/base/schema?' {
  const schema: {_validation: any[]; get: (name: string) => Schema} | undefined
  export default schema
}

declare module 'part:@sanity/base/preview?' {
  const preview: React.ComponentType<{
    layout: 'default'
    status: React.ReactNode
    type: Schema
    value: any
  }>
  export default preview
}

declare module 'part:@sanity/base/util/draft-utils' {
  export const getPublishedId: (str: string) => string
}

declare module 'part:@sanity/base/search' {
  const search: (queryStr: string) => Observable
  export default search
}

declare module 'part:@sanity/base/version-checker' {
  const VersionChecker: {
    checkVersions: () => Promise<{
      result: {
        outdated: {
          name: string
          latest: string
          severity: 'notice' | 'low' | 'medium' | 'high'
          version: string
        }[]
        isSupported: boolean
        isUpToDate: boolean
      }
    }>
  }
  export default VersionChecker
}

declare module 'part:@sanity/base/util/document-action-utils' {
  export const isActionEnabled: (schema: Schema, actionName: string) => boolean
}

declare module 'part:@sanity/base/new-document-structure?' {
  const newDocumentStructure: any | undefined
  export default newDocumentStructure
}

declare module 'part:@sanity/base/client' {
  const client: any
  export default client
}

declare module 'part:@sanity/base/authentication-fetcher' {
  const fetcher: any
  export default fetcher
}
