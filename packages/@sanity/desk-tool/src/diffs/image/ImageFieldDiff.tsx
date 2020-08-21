import * as React from 'react'
import {
  DiffComponent,
  ObjectDiff,
  DiffAnnotationTooltip,
  useAnnotationColor
} from '@sanity/field/diff'
import ArrowIcon from 'part:@sanity/base/arrow-right'
import {resolveDiffComponent} from '../resolveDiffComponent'
import {FallbackDiff} from '../_fallback/FallbackDiff'
import styles from './ImageFieldDiff.css'
import {Image} from './types'
import ImagePreview from './ImagePreview'

/**
 * Todo:
 * - Indicate hotspot/crop changes
 * - ✅ Show diffs for metadata fields
 */

export const ImageFieldDiff: DiffComponent<ObjectDiff<Image>> = ({diff, schemaType}) => {
  // TODO: get the right annotations based on _ref, hotspot, crop field
  const annotation = diff.isChanged ? diff.annotation : undefined
  const userColor = useAnnotationColor(annotation)
  const {fromValue, toValue} = diff
  const fromAsset = fromValue?.asset
  const toAsset = toValue?.asset
  const prev = fromAsset?._ref
  const next = toAsset?._ref

  const imageMeta = ['crop', 'hotspot']

  // Get all the changed fields within this image field
  const changedFields = Object.keys(diff.fields)
    .map(field => ({
      name: field,
      ...diff.fields[field]
    }))
    .filter(field => field.isChanged && field.name !== '_type')

  // An array of names of the fields that changed
  const changedFieldNames = changedFields.map(f => f.name)

  // Find out if only image specific fields changed
  const didAssetChange = changedFieldNames.some(field => field === 'asset')
  const didMetaChange = changedFieldNames.some(field => imageMeta.includes(field))

  const showImageDiff = didAssetChange || didMetaChange

  // Create an array of the nested fields with their diffs and schema types
  // to resolve them to the right diff components (exclude fields specific to the image asset)
  const nestedFields = schemaType.fields
    .filter(
      field =>
        changedFields.some(f => f.name === field.name) &&
        !['asset', ...imageMeta].includes(field.name)
    )
    .map(field => ({name: field.name, schemaType: field.type, diff: diff.fields[field.name]}))

  return (
    <div className={styles.root}>
      {showImageDiff && (
        <DiffAnnotationTooltip annotation={annotation}>
          <div className={styles.imageDiff} data-diff-layout={prev && next ? 'double' : 'single'}>
            {prev && (
              <ImagePreview
                asset={fromAsset}
                color={userColor}
                action={didAssetChange ? 'removed' : 'changed'}
                // hotspot={didMetaChange && fromValue!.hotspot}
                // crop={didMetaChange && fromValue!.crop}
              />
            )}
            {prev && next && (
              <div className={styles.arrow}>
                <ArrowIcon />
              </div>
            )}
            {next && (
              <ImagePreview
                asset={toAsset}
                color={userColor}
                action={didAssetChange ? 'added' : 'changed'}
                // hotspot={didMetaChange && toValue!.hotspot}
                // crop={didMetaChange && toValue!.crop}
              />
            )}
          </div>
        </DiffAnnotationTooltip>
      )}

      {nestedFields.length > 0 && (
        <div className={styles.nestedFields}>
          {nestedFields.map(field => {
            const MetaDiffComponent = resolveDiffComponent(field.schemaType) || FallbackDiff
            return (
              <div className={styles.field} key={field.name}>
                <div className={styles.title}>{field.schemaType.title}</div>
                <MetaDiffComponent diff={field.diff} schemaType={field.schemaType} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
