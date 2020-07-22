import {Input} from '../types'

/** flatten takes an Input and converts it to a plain JavaScript value. */
export function flatten<A>(input: Input<A>): unknown {
  switch (input.type) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'null': {
      return input.data
    }
    case 'array': {
      let result: unknown[] = []
      let length = input.length
      for (let i = 0; i < length; i++) {
        result.push(flatten(input.at(i)))
      }
      return result
    }
    case 'object': {
      let result: Record<string, unknown> = {}
      for (let key of input.keys) {
        result[key] = flatten(input.get(key)!) 
      }
      return result
    }
  }
}
