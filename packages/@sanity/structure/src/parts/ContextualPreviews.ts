import getDefaultModule from './getDefaultModule'

// We are lazy-loading the part to work around typescript trying to resolve it
export const ContextualPreviews = (): Function =>
  getDefaultModule(require('part:@sanity/base/contextual-previews'))
