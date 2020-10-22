import {useEffect, useState} from 'react'
import client from 'part:@sanity/base/client'

export const useDocuments = (id, query) => {
  const [documents, setDocuments] = useState([])

  const fetchDocuments = () => {
    client.fetch(query).then(res => {
      handleReceiveDocuments(res)
    })
  }
  const handleReceiveDocuments = docs => {
    setDocuments(docs)
  }

  useEffect(() => {
    if (id) {
      fetchDocuments()
    }

    const subscription = client.observable.listen(query).subscribe(() => {
      setTimeout(() => {
        fetchDocuments()
      }, 2500)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  return documents || []
}
