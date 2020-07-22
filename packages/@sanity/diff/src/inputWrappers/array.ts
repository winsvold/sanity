import { ArrayInput, Input } from "../types"
import { wrap } from "."

export default class ArrayWrapper<A> implements ArrayInput<A> {
  type: 'array' = 'array'
  length: number
  annotation: A

  private data: unknown[]
  private elements: Input<A>[] = []

  constructor(data: unknown[], annotation: A) {
    this.annotation = annotation
    this.data = data
    this.length = data.length
  }

  at(idx: number) {
    if (idx >= this.length) throw new Error('out of bounds')
    let input = this.elements[idx]
    if (input) {
      return input
    } else {
      return (this.elements[idx] = wrap(this.data[idx], this.annotation))
    }
  }
}