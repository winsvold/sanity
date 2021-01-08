import {isEqual} from 'lodash'
import {useEffect, useRef, useState} from 'react'

export function useUnique<T>(v: T): T {
  const [value, setValue] = useState<T>(v)
  const valueRef = useRef<T>(value)

  useEffect(() => {
    const prevSelection = valueRef.current

    valueRef.current = v

    if (prevSelection === v || isEqual(prevSelection, v)) {
      return
    }

    // console.log('useUnique: value changed')

    setValue(v)
  }, [v])

  return value
}

// export function useDebugChange(msg: string, value: unknown): void {
//   useEffect(() => console.log(msg, {value}), [msg, value])
// }
