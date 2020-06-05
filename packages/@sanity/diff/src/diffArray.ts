import {ArrayDiff, Maybe, Path, KeyedSanityObject, Diff} from './types'
import {diffItem} from './diffItem'

export function diffArray<T = unknown>(
  fromValue: Maybe<T[]>,
  toValue: Maybe<T[]>,
  path: Path = []
): ArrayDiff {
  const from = fromValue || []
  const to = toValue || []

  let items: Diff[] = []
  if (from !== to) {
    items =
      isUniquelyKeyed(from) && isUniquelyKeyed(to)
        ? diffArrayByKey(from, to, path)
        : diffArrayByIndex(from, to, path)
  }

  return {
    type: 'array',
    path,
    fromValue,
    toValue,
    items,
    isChanged: items.length > 0
  }
}

function diffArrayByIndex(fromValue: unknown[], toValue: unknown[], path: Path): Diff[] {
  const children: Diff[] = []
  const length = Math.max(fromValue.length, toValue.length)

  for (let i = 0; i < length; i++) {
    const diff = diffItem(fromValue[i], toValue[i], path.concat(i))
    if (diff && diff.isChanged) {
      children.push(diff)
    }
  }

  return children
}

function diffArrayByKey(
  fromValue: KeyedSanityObject[],
  toValue: KeyedSanityObject[],
  path: Path
): Diff[] {
  const children: Diff[] = []

  const keyedA = indexByKey(fromValue)
  const keyedB = indexByKey(toValue)

  // There's a bunch of hard/semi-hard problems related to using keys
  // Unless we have the exact same order, just use indexes for now
  if (!arraysAreEqual(keyedA.keys, keyedB.keys)) {
    return diffArrayByIndex(fromValue, toValue, path)
  }

  for (let i = 0; i < keyedB.keys.length; i++) {
    const key = keyedB.keys[i]
    const valueA = keyedA.index[key]
    const valueB = keyedB.index[key]
    const diff = diffItem(valueA, valueB, path.concat({_key: key}))

    if (diff && diff.isChanged) {
      children.push(diff)
    }
  }

  return children
}

function isUniquelyKeyed(arr: unknown[]): arr is KeyedSanityObject[] {
  const keys: string[] = []

  for (let i = 0; i < arr.length; i++) {
    const key = getKey(arr[i])
    if (!key || keys.indexOf(key) !== -1) {
      return false
    }

    keys.push(key)
  }

  return true
}

function getKey(obj: unknown): string | undefined {
  return (typeof obj === 'object' && obj !== null && (obj as KeyedSanityObject)._key) || undefined
}

function indexByKey(
  arr: KeyedSanityObject[]
): {keys: string[]; index: {[key: string]: KeyedSanityObject}} {
  return arr.reduce(
    (acc, item) => {
      acc.keys.push(item._key)
      acc.index[item._key] = item
      return acc
    },
    {keys: [] as string[], index: {} as {[key: string]: KeyedSanityObject}}
  )
}

function arraysAreEqual(fromValue: unknown[], toValue: unknown[]): boolean {
  return fromValue.length === toValue.length && fromValue.every((item, i) => toValue[i] === item)
}
