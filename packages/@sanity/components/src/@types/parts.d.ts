/* eslint-disable import/export */

declare module 'part:@sanity/components/autocomplete/default-style'
declare module 'part:@sanity/components/buttons/button-grid-style'
declare module 'part:@sanity/components/buttons/default-style'
declare module 'part:@sanity/components/buttons/dropdown-style'
declare module 'part:@sanity/components/buttons/in-input-style'
declare module 'part:@sanity/components/dialogs/content-style'
declare module 'part:@sanity/components/dialogs/default-style'
declare module 'part:@sanity/components/dialogs/fullscreen-style'
declare module 'part:@sanity/components/dialogs/popover-style'
declare module 'part:@sanity/components/fieldsets/default-style'
declare module 'part:@sanity/components/fileinput/button'
declare module 'part:@sanity/components/edititem/fold-style'
declare module 'part:@sanity/components/formfields/default-style'
declare module 'part:@sanity/components/labels/default-style'
declare module 'part:@sanity/components/loading/spinner-style'
declare module 'part:@sanity/components/menus/default-style'
declare module 'part:@sanity/components/previews/block-image-style'
declare module 'part:@sanity/components/previews/block-style'
declare module 'part:@sanity/components/previews/card-style'
declare module 'part:@sanity/components/previews/default-style'
declare module 'part:@sanity/components/previews/detail-style'
declare module 'part:@sanity/components/previews/inline-style'
declare module 'part:@sanity/components/previews/media-style'
declare module 'part:@sanity/components/progress/bar-style'
declare module 'part:@sanity/components/progress/circle-style'
declare module 'part:@sanity/components/selects/custom-style'
declare module 'part:@sanity/components/selects/default-style'
declare module 'part:@sanity/components/selects/searchable-style'
declare module 'part:@sanity/components/selects/style-style'
declare module 'part:@sanity/components/tags/textfield-style'
declare module 'part:@sanity/components/textareas/default-style'
declare module 'part:@sanity/components/textfields/default-style'
declare module 'part:@sanity/components/textfields/search-style'
declare module 'part:@sanity/components/textinputs/default-style'
declare module 'part:@sanity/components/toggles/buttons-style'

/*
 * @sanity/base
 */

declare module 'part:@sanity/base/theme/typography/headings-style'
declare module 'part:@sanity/base/theme/typography/text-blocks-style'

declare module 'part:@sanity/base/brand-logo?' {
  const BrandLogo: React.ComponentType<Record<string, unknown>> | undefined
  export default BrandLogo
}

declare module 'part:@sanity/base/router' {
  export * from '@sanity/base/src/router'
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Because `@sanity/components` depends on `@sanity/base` we need these "ambient" definitions
///////////////////////////////////////////////////////////////////////////////////////////////////
declare module 'part:@sanity/base/client'
declare module 'part:@sanity/base/authentication-fetcher'
declare module 'part:@sanity/base/user'
