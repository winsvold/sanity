import {ArrayDiff, ArrayInput, Input, ItemDiffSegment, DiffOptions} from '../types'
import {lazyFlatten, lazyDiff} from './lazy'

export function diffArray<A>(
  fromInput: ArrayInput<A>,
  toInput: ArrayInput<A>,
  options: DiffOptions
): ArrayDiff<A> {
  const keyedA = indexByKey(fromInput)
  const keyedB = indexByKey(toInput)

  const elements =
    keyedA && keyedB && arraysAreEqual(keyedA.keys, keyedB.keys)
      ? diffArrayByKey(keyedA, keyedB)
      : diffArrayByIndex(fromInput, toInput)

  // TODO: Handle diffing by keys when they have also moved
  // TODO: Handle diffing of string/number arrays

  return {
    type: 'array',
    elements,
    state: fromInput === toInput ? 'unchanged' : 'unknown'
  }
}

function diffArrayByIndex<A>(
  fromInput: ArrayInput<A>,
  toInput: ArrayInput<A>
): ItemDiffSegment<A>[] {
  const elements: ItemDiffSegment<A>[] = []
  const commonLength = Math.min(fromInput.length, toInput.length)

  for (let i = 0; i < commonLength; i++) {
    elements.push(lazyDiff({type: 'unchanged'}, fromInput.at(i), toInput.at(i)))
  }

  for (let i = commonLength; i < fromInput.length; i++) {
    elements.push(lazyFlatten({type: 'removed', annotation: fromInput.annotation}, fromInput.at(i)))
  }

  for (let i = commonLength; i < toInput.length; i++) {
    elements.push(lazyFlatten({type: 'added', annotation: toInput.annotation}, toInput.at(i)))
  }

  return elements
}

/**
 * Diff an array when all the elements have _key in the same position.
 */
function diffArrayByKey<A>(
  fromKeyIndex: KeyIndex<A>,
  toKeyIndex: KeyIndex<A>
): ItemDiffSegment<A>[] {
  const elements: ItemDiffSegment<A>[] = []

  for (let i = 0; i < fromKeyIndex.keys.length; i++) {
    const key = fromKeyIndex.keys[i]
    const fromInput = fromKeyIndex.index.get(key)!.item
    const toInput = toKeyIndex.index.get(key)!.item
    elements.push(lazyDiff({type: 'unchanged'}, fromInput, toInput))
  }

  return elements
}

type KeyIndex<A> = {
  keys: string[]
  index: Map<string, ItemEntry<A>>
}

type ItemEntry<A> = {
  item: Input<A>
  index: number
}

function indexByKey<A>(arr: ArrayInput<A>): KeyIndex<A> | undefined {
  let index = new Map<string, ItemEntry<A>>()
  let keys: string[] = []
  let length = arr.length

  for (let i = 0; i < length; i++) {
    let item = arr.at(i)
    if (item.type !== 'object') return
    let key = item.get('_key')
    if (!key || key.type !== 'string') return
    keys.push(key.data)
    index.set(key.data, {item, index: i})
  }

  return {keys, index}
}

function arraysAreEqual(fromValue: unknown[], toValue: unknown[]): boolean {
  return fromValue.length === toValue.length && fromValue.every((item, i) => item === toValue[i])
}
