/* eslint-disable import/export */

// declare module 'part:*'
// declare module 'all:part:*'

/*
 * Global and local parts
 */

declare module 'all:part:@sanity/desk-tool/after-editor-component'
declare module 'part:@sanity/desk-tool/filter-fields-fn?'
declare module 'part:@sanity/desk-tool/language-select-component?'
declare module 'part:@sanity/transitional/production-preview/resolve-production-url?'

/*
 * @sanity/base
 */

declare module 'part:@sanity/base/actions/utils'
declare module 'part:@sanity/base/authentication-fetcher'
declare module 'part:@sanity/base/client'
declare module 'part:@sanity/base/datastore/document'
declare module 'part:@sanity/base/datastore/presence'

declare module 'all:part:@sanity/base/diff-resolver' {
  import {ComponentType} from 'react'

  type DiffComponent = ComponentType<unknown>
  type DiffResolver = (schemaType: unknown) => DiffComponent | undefined

  const diffResolvers: DiffResolver[]
  export default diffResolvers
}

declare module 'part:@sanity/base/document-actions/resolver'
declare module 'part:@sanity/base/document-badges/resolver'
declare module 'part:@sanity/base/preview'

declare module 'part:@sanity/base/router' {
  // @todo: replace all of this with:
  // export * from '@sanity/base/src/router'

  export * from '@sanity/state-router'

  type IntentLinkProps = any

  interface StateLinkProps {
    ref?: any
    state?: Record<string, any>
    toIndex?: boolean
  }

  type IntentParameters = Record<string, any> | [Record<string, any>, Record<string, any>]

  type RouterState = Record<string, any>

  export type Router<S = Record<any, any>> = {
    navigate: (nextState: Record<string, any>, options?: NavigateOptions) => void
    navigateIntent: (
      intentName: string,
      params?: IntentParameters,
      options?: NavigateOptions
    ) => void
    state: S
  }

  export const useRouter: () => Router
  export const IntentLink: React.ComponentType<IntentLinkProps>
  export const StateLink: React.ComponentType<StateLinkProps>

  export const withRouterHOC: (source: React.ComponentType<any>) => React.ComponentType<any>
}

declare module 'part:@sanity/base/schema'
declare module 'part:@sanity/base/user'
declare module 'part:@sanity/base/util/document-action-utils'
declare module 'part:@sanity/base/util/draft-utils'

// icons
declare module 'part:@sanity/base/angle-down-icon' {
  export {default} from '@sanity/components/src/icons/AngleDownIcon'
}
declare module 'part:@sanity/base/angle-up-icon' {
  export {default} from '@sanity/components/src/icons/AngleUpIcon'
}
declare module 'part:@sanity/base/arrow-drop-down' {
  export {default} from '@sanity/components/src/icons/ArrowDropDown'
}
declare module 'part:@sanity/base/arrow-right' {
  export {default} from '@sanity/components/src/icons/ArrowRight'
}
declare module 'part:@sanity/base/bars-icon' {
  export {default} from '@sanity/components/src/icons/Bars'
}
declare module 'part:@sanity/base/binary-icon' {
  export {default} from '@sanity/components/src/icons/Binary'
}
declare module 'part:@sanity/base/block-object-icon' {
  export {default} from '@sanity/components/src/icons/BlockObject'
}
declare module 'part:@sanity/base/calendar-icon' {
  export {default} from '@sanity/components/src/icons/Calendar'
}
declare module 'part:@sanity/base/check-icon' {
  export {default} from '@sanity/components/src/icons/Check'
}
declare module 'part:@sanity/base/chevron-down-icon' {
  export {default} from '@sanity/components/src/icons/ChevronDown'
}
declare module 'part:@sanity/base/clipboard-icon' {
  export {default} from '@sanity/components/src/icons/Clipboard'
}
declare module 'part:@sanity/base/clipboard-image-icon' {
  export {default} from '@sanity/components/src/icons/ClipboardImage'
}
declare module 'part:@sanity/base/close-icon' {
  export {default} from '@sanity/components/src/icons/CloseIcon'
}
declare module 'part:@sanity/base/circle-check-icon' {
  export {default} from '@sanity/components/src/icons/CheckCircle'
}
declare module 'part:@sanity/base/circle-thin-icon' {
  export {default} from '@sanity/components/src/icons/CircleThin'
}
declare module 'part:@sanity/base/cog-icon' {
  export {default} from '@sanity/components/src/icons/Cog'
}
declare module 'part:@sanity/base/comment-icon' {
  export {default} from '@sanity/components/src/icons/Comment'
}
declare module 'part:@sanity/base/compose-icon' {
  export {default} from '@sanity/components/src/icons/Compose'
}
declare module 'part:@sanity/base/content-copy-icon' {
  export {default} from '@sanity/components/src/icons/ContentCopy'
}
declare module 'part:@sanity/base/danger-icon' {
  export {default} from '@sanity/components/src/icons/Danger'
}
declare module 'part:@sanity/base/drag-handle-icon' {
  export {default} from '@sanity/components/src/icons/DragHandle'
}
declare module 'part:@sanity/base/edit-icon' {
  export {default} from '@sanity/components/src/icons/Edit'
}
declare module 'part:@sanity/base/error-icon' {
  export {default} from '@sanity/components/src/icons/Error'
}
declare module 'part:@sanity/base/error-outline-icon' {
  export {default} from '@sanity/components/src/icons/ErrorOutline'
}
declare module 'part:@sanity/base/warning-outline-icon' {
  export {default} from '@sanity/components/src/icons/WarningOutline'
}
declare module 'part:@sanity/base/eye-icon' {
  export {default} from '@sanity/components/src/icons/Eye'
}
declare module 'part:@sanity/base/file-icon' {
  export {default} from '@sanity/components/src/icons/File'
}
declare module 'part:@sanity/base/folder-icon' {
  export {default} from '@sanity/components/src/icons/Folder'
}
declare module 'part:@sanity/base/format-bold-icon' {
  export {default} from '@sanity/components/src/icons/FormatBold'
}
declare module 'part:@sanity/base/format-code-icon' {
  export {default} from '@sanity/components/src/icons/FormatCode'
}
declare module 'part:@sanity/base/format-italic-icon' {
  export {default} from '@sanity/components/src/icons/FormatItalic'
}
declare module 'part:@sanity/base/format-list-bulleted-icon' {
  export {default} from '@sanity/components/src/icons/FormatListBulleted'
}
declare module 'part:@sanity/base/format-list-numbered-icon' {
  export {default} from '@sanity/components/src/icons/FormatListNumbered'
}
declare module 'part:@sanity/base/format-quote-icon' {
  export {default} from '@sanity/components/src/icons/FormatQuote'
}
declare module 'part:@sanity/base/format-strikethrough-icon' {
  export {default} from '@sanity/components/src/icons/FormatStrikethrough'
}
declare module 'part:@sanity/base/format-underlined-icon' {
  export {default} from '@sanity/components/src/icons/FormatUnderlined'
}
declare module 'part:@sanity/base/fullscreen-icon' {
  export {default} from '@sanity/components/src/icons/Fullscreen'
}
declare module 'part:@sanity/base/fullscreen-exit-icon' {
  export {default} from '@sanity/components/src/icons/FullscreenExit'
}
declare module 'part:@sanity/base/hamburger-icon' {
  export {default} from '@sanity/components/src/icons/Hamburger'
}
declare module 'part:@sanity/base/history-icon' {
  export {default} from '@sanity/components/src/icons/History'
}
declare module 'part:@sanity/base/image-area-icon' {
  export {default} from '@sanity/components/src/icons/ImageArea'
}
declare module 'part:@sanity/base/image-icon' {
  export {default} from '@sanity/components/src/icons/Image'
}
declare module 'part:@sanity/base/images-icon' {
  export {default} from '@sanity/components/src/icons/Images'
}
declare module 'part:@sanity/base/info-icon' {
  export {default} from '@sanity/components/src/icons/Info'
}
declare module 'part:@sanity/base/inline-object-icon' {
  export {default} from '@sanity/components/src/icons/InlineObject'
}
declare module 'part:@sanity/base/launch-icon' {
  export {default} from '@sanity/components/src/icons/Launch'
}
declare module 'part:@sanity/base/lightbulb-icon' {
  export {default} from '@sanity/components/src/icons/Lightbulb'
}
declare module 'part:@sanity/base/link-icon' {
  export {default} from '@sanity/components/src/icons/Link'
}
declare module 'part:@sanity/base/more-vert-icon' {
  export {default} from '@sanity/components/src/icons/MoreVert'
}
declare module 'part:@sanity/base/package-icon' {
  export {default} from '@sanity/components/src/icons/Package'
}
declare module 'part:@sanity/base/paste-icon' {
  export {default} from '@sanity/components/src/icons/Paste'
}
declare module 'part:@sanity/base/plugin-icon' {
  export {default} from '@sanity/components/src/icons/Plug'
}
declare module 'part:@sanity/base/plus-icon' {
  export {default} from '@sanity/components/src/icons/Plus'
}
declare module 'part:@sanity/base/plus-circle-icon' {
  export {default} from '@sanity/components/src/icons/PlusCircle'
}
declare module 'part:@sanity/base/plus-circle-outline-icon' {
  export {default} from '@sanity/components/src/icons/PlusCircleOutline'
}
declare module 'part:@sanity/base/public-icon' {
  export {default} from '@sanity/components/src/icons/Public'
}
declare module 'part:@sanity/base/publish-icon' {
  export {default} from '@sanity/components/src/icons/Publish'
}
declare module 'part:@sanity/base/question-icon' {
  export {default} from '@sanity/components/src/icons/Question'
}
declare module 'part:@sanity/base/reset-icon' {
  export {default} from '@sanity/components/src/icons/Reset'
}
declare module 'part:@sanity/base/sanity-logo-icon' {
  export {default} from '@sanity/components/src/icons/SanityLogo'
}
declare module 'part:@sanity/base/search-icon' {
  export {default} from '@sanity/components/src/icons/Search'
}
declare module 'part:@sanity/base/sign-out-icon' {
  export {default} from '@sanity/components/src/icons/SignOut'
}
declare module 'part:@sanity/base/spinner-icon' {
  export {default} from '@sanity/components/src/icons/SpinnerIcon'
}
declare module 'part:@sanity/base/split-horizontal-icon' {
  export {default} from '@sanity/components/src/icons/SplitHorizontal'
}
declare module 'part:@sanity/base/sort-alpha-desc-icon' {
  export {default} from '@sanity/components/src/icons/SortAlphaDesc'
}
declare module 'part:@sanity/base/sort-icon' {
  export {default} from '@sanity/components/src/icons/Sort'
}
declare module 'part:@sanity/base/stack-compact-icon' {
  export {default} from '@sanity/components/src/icons/StackCompact'
}
declare module 'part:@sanity/base/stack-icon' {
  export {default} from '@sanity/components/src/icons/Stack'
}
declare module 'part:@sanity/base/sync-icon' {
  export {default} from '@sanity/components/src/icons/Sync'
}
declare module 'part:@sanity/base/th-large-icon' {
  export {default} from '@sanity/components/src/icons/ThLarge'
}
declare module 'part:@sanity/base/th-list-icon' {
  export {default} from '@sanity/components/src/icons/ThList'
}
declare module 'part:@sanity/base/time-icon' {
  export {default} from '@sanity/components/src/icons/Time'
}
declare module 'part:@sanity/base/trash-icon' {
  export {default} from '@sanity/components/src/icons/Trash'
}
declare module 'part:@sanity/base/trash-outline-icon' {
  export {default} from '@sanity/components/src/icons/TrashOutline'
}
declare module 'part:@sanity/base/truncate-icon' {
  export {default} from '@sanity/components/src/icons/Truncate'
}
declare module 'part:@sanity/base/undo-icon' {
  export {default} from '@sanity/components/src/icons/Undo'
}
declare module 'part:@sanity/base/unpublish-icon' {
  export {default} from '@sanity/components/src/icons/Unpublish'
}
declare module 'part:@sanity/base/upload-icon' {
  export {default} from '@sanity/components/src/icons/Upload'
}
declare module 'part:@sanity/base/user-icon' {
  export {default} from '@sanity/components/src/icons/User'
}
declare module 'part:@sanity/base/users-icon' {
  export {default} from '@sanity/components/src/icons/UsersIcon'
}
declare module 'part:@sanity/base/visibility-off-icon' {
  export {default} from '@sanity/components/src/icons/VisibilityOff'
}
declare module 'part:@sanity/base/view-column-icon' {
  export {default} from '@sanity/components/src/icons/ViewColumn'
}
declare module 'part:@sanity/base/visibility-icon' {
  export {default} from '@sanity/components/src/icons/Visibility'
}
declare module 'part:@sanity/base/warning-icon' {
  export {default} from '@sanity/components/src/icons/Warning'
}

/*
 * @sanity/components
 */

declare module 'part:@sanity/components/avatar' {
  export * from '@sanity/components/src/avatar'
}

declare module 'part:@sanity/components/badges/default' {
  export {default} from '@sanity/components/src/badges/DefaultBadge'
}

declare module 'part:@sanity/components/buttons/button-grid-style'
declare module 'part:@sanity/components/buttons/button-grid' {
  export {default} from '@sanity/components/src/buttons/ButtonGrid'
}

declare module 'part:@sanity/components/buttons/default-style'
declare module 'part:@sanity/components/buttons/default' {
  export * from '@sanity/components/src/buttons/DefaultButton'
  export {default} from '@sanity/components/src/buttons/DefaultButton'
}
declare module 'part:@sanity/components/buttons/intent' {
  export {default} from '@sanity/components/src/buttons/IntentButton'
}

declare module 'part:@sanity/components/click-outside' {
  export * from '@sanity/components/src/clickOutside'
}

declare module 'part:@sanity/components/container-query' {
  export * from '@sanity/components/src/containerQuery'
}

declare module 'part:@sanity/components/dialogs/content-style'
declare module 'part:@sanity/components/dialogs/content' {
  export {default} from '@sanity/components/src/dialogs/DialogContent'
}

declare module 'part:@sanity/components/dialogs/default-style'
declare module 'part:@sanity/components/dialogs/default' {
  export {default} from '@sanity/components/src/dialogs/DefaultDialog'
}

declare module 'part:@sanity/components/dialogs/fullscreen-style'
declare module 'part:@sanity/components/dialogs/fullscreen' {
  export {default} from '@sanity/components/src/dialogs/FullscreenDialog'
}

declare module 'part:@sanity/components/dialogs/popover-style'
declare module 'part:@sanity/components/dialogs/popover' {
  export {default} from '@sanity/components/src/dialogs/PopoverDialog'
}

declare module 'part:@sanity/components/loading/spinner-style'
declare module 'part:@sanity/components/loading/spinner' {
  export {default} from '@sanity/components/src/loading/Spinner'
}

declare module 'part:@sanity/components/menu-button' {
  export * from '@sanity/components/src/menuButton'
}

declare module 'part:@sanity/components/menus/default-style'
declare module 'part:@sanity/components/menus/default' {
  export * from '@sanity/components/src/menus/DefaultMenu'
  export {default} from '@sanity/components/src/menus/DefaultMenu'
}

declare module 'part:@sanity/components/layer' {
  export * from '@sanity/components/src/layer'
}

declare module 'part:@sanity/components/panes/default' {
  export {default} from '@sanity/components/src/panes/DefaultPane'
}

declare module 'part:@sanity/components/popover' {
  export * from '@sanity/components/src/popover'
}

declare module 'part:@sanity/components/portal' {
  export * from '@sanity/components/src/portal'
}

declare module 'part:@sanity/components/scroll' {
  export * from '@sanity/components/src/scroll'
}

declare module 'part:@sanity/components/snackbar/default' {
  export {default} from '@sanity/components/src/snackbar/DefaultSnackbar'
}

declare module 'part:@sanity/components/tabs/tab' {
  export {default} from '@sanity/components/src/tabs/Tab'
}

declare module 'part:@sanity/components/tabs/tab-list' {
  export {default} from '@sanity/components/src/tabs/TabList'
}

declare module 'part:@sanity/components/tabs/tab-panel' {
  export {default} from '@sanity/components/src/tabs/TabPanel'
}

declare module 'part:@sanity/components/tooltip' {
  export * from '@sanity/components/src/tooltip'
}

declare module 'part:@sanity/components/typography/hotkeys' {
  export {default} from '@sanity/components/src/typography/Hotkeys'
}

declare module 'part:@sanity/components/utilities/escapable' {
  export {default} from '@sanity/components/src/utilities/Escapable'
}

declare module 'part:@sanity/components/validation/list' {
  export {default} from '@sanity/components/src/validation/ValidationList'
}

/*
 * @sanity/form-builder
 */

declare module 'part:@sanity/form-builder'
