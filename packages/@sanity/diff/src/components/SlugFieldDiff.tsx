import * as React from 'react'
import {StringFieldDiff} from './StringFieldDiff'
import {DiffComponent, SchemaType} from './types'
import {ObjectDiff, Maybe, StringDiff} from '../types'
import {isStringDiff} from '../calculate/getType'

interface Slug {
  current: Maybe<string>
}

export const SlugFieldDiff: DiffComponent<ObjectDiff<Slug>> = ({schemaType, fields}) => {
  const current = isStringDiff(fields.current) ? fields.current : null
  if (!current) {
    return null
  }

  const currentSchema = (schemaType.fields || []).find(field => field.name === 'current')
  if (!currentSchema) {
    return null
  }

  const stringFieldType = currentSchema.type as SchemaType<StringDiff>
  return <StringFieldDiff schemaType={stringFieldType} {...current} />
}
