import * as React from 'react'
import Preview from 'part:@sanity/base/preview?'
import {ObjectDiff} from '../types'
import {SchemaType, DiffComponent} from './types'
import {ReferenceFieldDiff} from './ReferenceFieldDiff'

interface Reference {
  _ref?: string
  _weak?: boolean
}

interface Image {
  asset?: Reference
  hotspot?: {
    x: number
    y: number
    width: number
    height: number
  }
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export const ImageFieldDiff: DiffComponent<ObjectDiff<Image>> = ({schemaType, fields}) => {
  const asset = fields.asset as ObjectDiff
  if (!asset) {
    return null
  }

  const imageSchema = (schemaType.fields || []).find(field => field.name === 'asset')
  if (!imageSchema) {
    return null
  }

  const assetFieldType = imageSchema.type as SchemaType<ObjectDiff>
  return <ReferenceFieldDiff schemaType={assetFieldType} {...asset} />
}
