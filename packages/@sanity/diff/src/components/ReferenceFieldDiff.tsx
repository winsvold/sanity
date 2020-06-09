import * as React from 'react'
import schema from 'part:@sanity/base/schema?'
import Preview from 'part:@sanity/base/preview?'
import {ObjectDiff} from '../types'
import {SchemaType, DiffComponent} from './types'
import {FieldDiffContainer} from './FieldDiffContainer'

interface Reference {
  _ref?: string
  _weak?: boolean
}

function getReferencedType(type: SchemaType<ObjectDiff>): SchemaType | undefined {
  if (!type.to) {
    return type.type ? getReferencedType(type.type) : undefined
  }

  const target = Array.isArray(type.to) ? type.to[0] : type.to
  return schema.get(target.name)
}

export const ReferenceFieldDiff: DiffComponent<ObjectDiff<Reference>> = ({
  schemaType,
  fromValue,
  toValue
}) => {
  const type = getReferencedType(schemaType)
  const prev = fromValue && fromValue._ref
  const next = toValue && toValue._ref

  return (
    <FieldDiffContainer>
      {prev && <Preview type={type} value={fromValue} layout="default" />}
      {prev && <div>⇩</div>}
      {next && <Preview type={type} value={toValue} layout="default" />}
    </FieldDiffContainer>
  )
}
