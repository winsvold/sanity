import { StringInput } from "../types"

export default class StringWrapper<A> implements StringInput<A> {
  type: 'string' = 'string'
  data: string
  annotation: A

  constructor(data: string, annotation: A) {
    this.data = data 
    this.annotation = annotation
  }

  sliceAnnotation(start: number, end: number) {
    return [{text: this.data.slice(start, end), annotation: this.annotation}]
  }
}