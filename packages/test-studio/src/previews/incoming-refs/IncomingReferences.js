import React from 'react'
import {IntentLink} from 'part:@sanity/base/router'
import Preview from './Preview'
import styles from './IncomingReferences.module.css'
import {useDocuments} from './hooks'

export default function IncomingReferences(props) {
  const {published} = props.document
  const query = `*[!(_id in path("drafts.**")) && references('${published._id}')]`
  const documents = useDocuments(published._id, query)
  return (
    <div className={styles.root}>
      {documents.length > 1 ? (
        documents.map(doc => (
          <IntentLink
            key={doc._id}
            className={styles.item}
            intent="edit"
            params={{id: doc._id, type: doc._type}}
          >
            <Preview id={doc._id} />
          </IntentLink>
        ))
      ) : (
        <div className={styles.noDocs}>No documents are referencing this document...</div>
      )}
    </div>
  )
}
