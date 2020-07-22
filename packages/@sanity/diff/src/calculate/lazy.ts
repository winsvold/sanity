import { flatten } from "./flatten"
import { Input } from "../types"
import { diffInput } from "./diffInput"

export function lazyValue<T, V>(obj: T, getter: () => V): T & { value: V } {
  let objWithValue = obj as any as T & { value: V }

  Object.defineProperty(obj, 'value', {
    configurable: true,
    enumerable: true,
    get() {
      let value = getter() as V
      delete objWithValue.value
      objWithValue.value = value
      return value
    }
  })

  return objWithValue
}

export function lazyFlatten<T, A>(obj: T, input: Input<A>) {
  return lazyValue(obj, () => flatten(input))
}

export function lazyDiff<T, A>(obj: T, fromInput: Input<A>, toInput: Input<A>) {
  return lazyValue(obj, () => diffInput(fromInput, toInput))
}