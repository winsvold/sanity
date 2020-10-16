import path from 'path'

const MONOREPO_PACKAGES_PATH = path.resolve(__dirname, '../../../..')

export function getMonorepoAliases() {
  function resolve(filePath) {
    return path.resolve(MONOREPO_PACKAGES_PATH, filePath)
  }

  return {
    '@sanity/base/lib/datastores/document/document-pair/remoteSnapshots': resolve(
      '@sanity/base/lib/datastores/document/document-pair/remoteSnapshots'
    ),
    '@sanity/base/initial-value-template-builder': resolve(
      '@sanity/base/initial-value-template-builder'
    ),
    '@sanity/base/initial-value-templates': resolve('@sanity/base/initial-value-templates'),
    '@sanity/base/lib/change-indicators': resolve('@sanity/base/lib/change-indicators'),
    '@sanity/base/lib/change-indicators/ChangeFieldWrapper': resolve(
      '@sanity/base/lib/change-indicators/ChangeFieldWrapper'
    ),
    '@sanity/base/lib/util/resizeObserver': resolve('@sanity/base/lib/util/resizeObserver'),
    '@sanity/base/structure-builder': resolve('@sanity/base/structure-builder'),
    '@sanity/base': resolve('@sanity/base/src'),
    '@sanity/block-tools': resolve('@sanity/block-tools/src'),
    '@sanity/components/lib/fieldsets/FieldStatus': resolve(
      '@sanity/components/lib/fieldsets/FieldStatus'
    ),
    '@sanity/components': resolve('@sanity/components/src'),
    '@sanity/field/lib/diff/resolve/diffResolver': resolve(
      '@sanity/field/lib/diff/resolve/diffResolver'
    ),
    '@sanity/field': resolve('@sanity/field/src'),
    '@sanity/initial-value-templates': resolve('@sanity/initial-value-templates/src'),
    '@sanity/mutator': resolve('@sanity/mutator/src'),
    '@sanity/preview/components': resolve('@sanity/preview/components'),
    '@sanity/preview': resolve('@sanity/preview'),
    '@sanity/schema/lib': resolve('@sanity/schema/lib'),
    '@sanity/schema': resolve('@sanity/schema/src/legacy'),
    '@sanity/state-router': resolve('@sanity/state-router/src'),
    '@sanity/structure': resolve('@sanity/structure/src'),
    '@sanity/util/paths': resolve('@sanity/util/src/pathUtils'),
    '@sanity/util': resolve('@sanity/util/src'),
    '@sanity/types': resolve('@sanity/types/src'),
    '@sanity/validation': resolve('@sanity/validation/src')
  }
}
