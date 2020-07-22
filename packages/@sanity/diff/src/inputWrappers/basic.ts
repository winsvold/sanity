type SimpleType = 'boolean' | 'number' | 'null'

export default class BasicWrapper<K extends SimpleType, V, A> {
  type: K
  data: V
  annotation: A

  constructor(type: K, data: V, annotation: A) {
    this.type = type
    this.data = data
    this.annotation = annotation
  }
}
