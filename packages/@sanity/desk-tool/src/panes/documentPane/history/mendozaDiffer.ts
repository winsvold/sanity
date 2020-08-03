import {Input, ArrayInput, ObjectInput, StringInput, wrap, Diff, diffInput} from '@sanity/diff'
import {Value, ArrayContent, ObjectContent, StringContent} from 'mendoza/lib/incremental-patcher'
import {Chunk, Annotation} from './types'

export type Meta = Chunk | null

export type Accessor = 'startMeta' | 'endMeta'

function reverseAccessor(accessor: Accessor): Accessor {
  return accessor === 'startMeta' ? 'endMeta' : 'startMeta'
}

class ArrayContentWrapper implements ArrayInput<Annotation> {
  type: 'array' = 'array'
  length: number
  annotation: Annotation
  accessor: Accessor

  private content: ArrayContent<Meta>
  private elements: Input<Annotation>[] = []

  constructor(content: ArrayContent<Meta>, annotation: Annotation, accessor: Accessor) {
    this.content = content
    this.annotation = annotation
    this.accessor = accessor
    this.length = content.elements.length
  }

  at(idx: number) {
    if (idx >= this.length) throw new Error('out of bounds')
    let input = this.elements[idx]
    if (input) {
      return input
    } else {
      return (this.elements[idx] = wrapValue(this.content.elements[idx], this.accessor))
    }
  }
}

class ObjectContentWrapper implements ObjectInput<Annotation> {
  type: 'object' = 'object'
  keys: string[]
  annotation: Annotation
  accessor: Accessor

  private content: ObjectContent<Meta>
  private fields: Record<string, Input<Meta>> = {}

  constructor(content: ObjectContent<Meta>, annotation: Annotation, accessor: Accessor) {
    this.content = content
    this.annotation = annotation
    this.accessor = accessor
    this.keys = Object.keys(content.fields)
  }

  get(key: string) {
    let input = this.fields[key]
    if (input) {
      return input
    } else {
      let value = this.content.fields[key]
      if (!value) return
      return (this.fields[key] = wrapValue(value, this.accessor))
    }
  }
}

class StringContentWrapper implements StringInput<Annotation> {
  type: 'string' = 'string'
  annotation: Annotation
  accessor: Accessor

  private content: StringContent<Meta>
  private _data?: string

  constructor(content: StringContent<Meta>, annotation: Annotation, accessor: Accessor) {
    this.content = content
    this.annotation = annotation
    this.accessor = accessor
  }

  get data() {
    if (this._data == null) {
      this._data = this.content.parts.map(part => part.value).join('')
    }
    return this._data
  }

  sliceAnnotation(start: number, end: number): {text: string; annotation: Annotation}[] {
    let result: {text: string; annotation: Annotation}[] = []
    let idx = 0

    for (let part of this.content.parts) {
      let length = part.value.length

      let subStart = Math.max(0, start - idx)
      if (subStart < length) {
        // The start of the slice is inside this part somewhere.

        // Figure out where the end is:
        let subEnd = Math.min(length, end - idx)

        // If the end of the slice is before this part, then we're guaranteed
        // that there are no more parts.
        if (subEnd <= 0) break

        result.push({
          text: part.value.slice(subStart, subEnd),
          annotation: part[this.accessor]
        })
      }

      idx += length
    }

    return result
  }
}

function wrapValue(input: Value<Meta>, accessor: Accessor): Input<Annotation> {
  let annotation = input[accessor]

  if (input.content) {
    switch (input.content.type) {
      case 'array':
        return new ArrayContentWrapper(input.content, annotation, accessor)
      case 'object':
        return new ObjectContentWrapper(input.content, annotation, accessor)
      case 'string':
        return new StringContentWrapper(input.content, annotation, accessor)
    }
  }

  let data = input.data!
  return wrap(data, annotation)
}

export function diffValue(from: Value<Meta>, to: Value<Meta>): Diff<Annotation> {
  let fromInput = wrapValue(from, 'endMeta')
  let toInput = wrapValue(to, 'startMeta')
  return diffInput(fromInput, toInput)
}
