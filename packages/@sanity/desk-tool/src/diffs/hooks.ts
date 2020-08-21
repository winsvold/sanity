import {useState, useEffect} from 'react'
import client from 'part:@sanity/base/client'

export function getRefValue(refId: string) {
  const [value, setValue] = useState({})
  useEffect(() => {
    const subscription = client.observable.getDocument(refId).subscribe(document => {
      setValue(document)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [refId])
  return value
}
