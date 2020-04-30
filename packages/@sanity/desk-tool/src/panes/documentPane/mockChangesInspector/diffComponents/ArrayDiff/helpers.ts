import {get} from 'lodash'

const PRIMITIVES = ['string', 'number', 'boolean']

export function isType(typeName, type) {
  return type.name === typeName || (type.type && isType(typeName, type.type))
}

export function primitive(type) {
  return PRIMITIVES.some(typeName => isType(typeName, type))
}

export function isArrayOfPrimitives(type) {
  return Array.isArray(type.of) && type.of.every(ofType => PRIMITIVES.includes(ofType.jsonType))
}

export function isTagsArray(type) {
  return (
    get(type.options, 'layout') === 'tags' &&
    Array.isArray(type.of) &&
    type.of.length === 1 &&
    isType('string', type.of[0])
  )
}

export function hasBlocks(type) {
  return Array.isArray(type.of) && type.of.some(memberType => memberType.type === 'block')
  // return Array.isArray(type.of) && type.of.some(memberType => isType('block', memberType))
}

export function hasOptionsList(type) {
  return Boolean(get(type.options, 'list'))
}
