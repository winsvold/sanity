import {Diff, Input, ArrayInput, StringInput, ObjectInput, SimpleInput, DiffOptions} from '../types'
import {diffArray} from './diffArray'
import {diffString} from './diffString'
import {diffTypeChange} from './diffTypeChange'
import {diffObject} from './diffObject'
import {diffSimple} from './diffSimple'

export function diffInput<A>(
  fromInput: Input<A>,
  toInput: Input<A>,
  options: DiffOptions = {}
): Diff<A> {
  // eg: null/undefined => string
  if (fromInput.type === 'null' && toInput.type !== 'null') {
    return diffWithType(
      toInput.type,
      createEmpty(toInput.type, fromInput.annotation),
      toInput,
      options
    )
  }

  // eg: number => null/undefined
  if (toInput.type === 'null' && fromInput.type !== 'null') {
    return diffWithType(
      fromInput.type,
      fromInput,
      createEmpty(fromInput.type, toInput.annotation),
      options
    )
  }

  // eg: array => array
  if (fromInput.type === toInput.type) {
    return diffWithType(fromInput.type, fromInput, toInput, options)
  }

  // eg: number => string
  return diffTypeChange(fromInput, toInput, options)
}

function diffWithType<A>(
  type: Input<A>['type'],
  fromInput: Input<A>,
  toInput: Input<A>,
  options: DiffOptions
): Diff<A> {
  switch (type) {
    case 'boolean':
    case 'number':
    case 'null':
      return diffSimple(fromInput as SimpleInput<A>, toInput as SimpleInput<A>, options)
    case 'string':
      return diffString(fromInput as StringInput<A>, toInput as StringInput<A>, options)
    case 'array':
      return diffArray(fromInput as ArrayInput<A>, toInput as ArrayInput<A>, options)
    case 'object':
      return diffObject(fromInput as ObjectInput<A>, toInput as ObjectInput<A>, options)
  }
}

const emptyInputs: {[P in Input<unknown>['type']]: any} = {
  string: {
    type: 'string',
    raw: '',
    substringAnnotation() {
      return this.annotation
    }
  },
  null: {
    type: 'null',
    raw: null
  },
  number: {
    type: 'number',
    raw: null
  },
  boolean: {
    type: 'boolean',
    raw: null
  },
  array: {
    type: 'array',
    length: 0,
    at() {
      throw new Error('out of bounds')
    }
  },
  object: {
    type: 'object',
    keys: [],
    get() {}
  }
}

function createEmpty<A>(type: Input<A>['type'], annotation: A): Input<A> {
  let result = Object.create(emptyInputs[type])
  result.annotation = annotation
  return result
}
