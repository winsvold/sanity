import {ObjectInput, Input} from '../types'
import {wrap} from '.'

export default class ObjectWrapper<A> implements ObjectInput<A> {
  type: 'object' = 'object'
  keys: string[]
  annotation: A

  private data: object
  private fields: Record<string, Input<A>> = {}

  constructor(data: object, annotation: A) {
    this.data = data
    this.annotation = annotation
    this.keys = Object.keys(data)
  }

  get(key: string) {
    let input = this.fields[key]
    if (input) {
      return input
    } else {
      if (!this.data.hasOwnProperty(key)) return
      let raw = this.data[key]
      return (this.fields[key] = wrap(raw, this.annotation))
    }
  }
}
