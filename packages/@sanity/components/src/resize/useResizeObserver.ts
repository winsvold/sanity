import {useEffect, useRef} from 'react'

const useResizeObserver = (callback: ResizeObserverCallback, initialReference: HTMLDivElement) => {
  const reference = useRef<HTMLDivElement | null>(initialReference)

  useEffect(() => {
    if (!reference.current) {
      return () => {}
    }

    const observer = new ResizeObserver(callback)

    observer.observe(reference.current)

    return () => {
      observer.disconnect()
    }
  }, [reference, callback])
}
