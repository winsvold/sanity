import {ObjectSchemaType, SchemaType} from '../types'
import {IncrementalValue, ComputedDiff} from '../history'
import {
  ArrayDiff,
  BooleanDiff,
  Diff,
  DiffType,
  NumberDiff,
  ObjectDiff,
  StringDiff,
  UnknownTypeDiff
} from './types'

function getFieldValue(value: IncrementalValue, fieldName: string): IncrementalValue | null {
  if (!value.content || value.content.type !== 'object') {
    return null
  }

  const fieldDiff = value.content.fields[fieldName]
  if (!fieldDiff || fieldDiff.origin === null) {
    return null
  }

  return fieldDiff
}

function getObjectDiff(
  schemaType: ObjectSchemaType,
  value: IncrementalValue,
  fromValue: unknown,
  toValue: unknown
): ObjectDiff {
  const fields: ObjectDiff['fields'] = {}
  const from = fromValue as Record<string, unknown>
  const to = toValue as Record<string, unknown>

  for (const field of schemaType.fields) {
    const fieldValue = getFieldValue(value, field.name)
    const diff =
      fieldValue && getMendozaDiff(field.type, fieldValue, from[field.name], to[field.name])

    if (!fieldValue || !diff) {
      continue
    }

    fields[field.name] = diff
  }

  return {
    type: 'object',
    fromValue: from,
    toValue: to,
    origin: value.origin,
    fields
  }
}

function getStringDiff(
  schemaType: SchemaType,
  value: IncrementalValue,
  fromValue: unknown,
  toValue: unknown
): StringDiff {
  if (!value.content || value.content.type !== 'string') {
    throw new Error('String diff needs a `content` property')
  }

  return {
    type: 'string',
    origin: value.origin,
    fromValue: fromValue as string,
    toValue: toValue as string,
    segments: value.content.parts.map(part => ({
      type: 'unchanged',
      origin: part.origin,
      text: part.value
    }))
  }
}

function getNumberDiff(
  schemaType: SchemaType,
  value: IncrementalValue,
  fromValue: unknown,
  toValue: unknown
): NumberDiff {
  return {
    type: 'number',
    origin: value.origin,
    fromValue: fromValue as number,
    toValue: toValue as number
  }
}

function getBooleanDiff(
  schemaType: SchemaType,
  value: IncrementalValue,
  fromValue: unknown,
  toValue: unknown
): BooleanDiff {
  return {
    type: 'boolean',
    origin: value.origin,
    fromValue: fromValue as boolean,
    toValue: toValue as boolean
  }
}

function getUnknownDiff(
  schemaType: SchemaType,
  value: IncrementalValue,
  fromValue: unknown,
  toValue: unknown
): UnknownTypeDiff {
  return {type: 'unknown', origin: value.origin, fromValue, toValue}
}

function getArrayDiff(
  schemaType: SchemaType,
  value: IncrementalValue,
  fromValue: unknown,
  toValue: unknown
): ArrayDiff {
  if (!value.content || value.content.type !== 'array') {
    throw new Error('Array diff needs a `content` property')
  }

  return {
    type: 'array',
    origin: value.origin,
    fromValue: fromValue as unknown[],
    toValue: toValue as unknown[],
    items: [] // @todo // value.content.elements.map(item => ({}))
  }
}

function getMendozaDiff(
  schemaType: SchemaType,
  value: IncrementalValue,
  fromValue: unknown,
  toValue: unknown
): Diff | null {
  if (!value.origin) {
    return null
  }

  const type: DiffType = value.content ? value.content.type : getDiffType(toValue || fromValue)
  switch (type) {
    case 'array':
      return getArrayDiff(schemaType, value, fromValue, toValue)
    case 'object':
      return getObjectDiff(schemaType, value, fromValue, toValue)
    case 'string':
      return getStringDiff(schemaType, value, fromValue, toValue)
    case 'number':
      return getNumberDiff(schemaType, value, fromValue, toValue)
    case 'boolean':
      return getBooleanDiff(schemaType, value, fromValue, toValue)
    default:
      return getUnknownDiff(schemaType, value, fromValue, toValue)
  }
}

function getDiffType(item: unknown): DiffType {
  if (Array.isArray(item)) {
    return 'array'
  }

  if (item === null || typeof item === 'undefined') {
    return 'null'
  }

  const type = typeof item
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'object':
      return type
    default:
      return 'unknown'
  }
}

export function getDocumentDiff(schemaType: SchemaType, diff: ComputedDiff): ObjectDiff | null {
  if (!diff || !diff.value || !diff.value.origin) {
    return null
  }

  return getObjectDiff(schemaType, diff.value, diff.from, diff.to)
}
