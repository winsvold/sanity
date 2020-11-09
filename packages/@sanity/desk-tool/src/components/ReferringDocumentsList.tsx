import {DefaultList, DefaultListItem} from '@sanity/base/__legacy/components'
import React from 'react'
import Preview from 'part:@sanity/base/preview'
import {IntentLink} from 'part:@sanity/base/router'
import schema from 'part:@sanity/base/schema'
import styles from './ReferringDocumentsList.css'
import DraftStatus from './DraftStatus'

interface ReferringDocumentsListProps {
  documents: {
    _id: string
    _type?: string
    _hasDraft: boolean
  }[]
}

export default function ReferringDocumentsList(props: ReferringDocumentsListProps) {
  const {documents} = props

  return (
    <DefaultList className={styles.root}>
      {documents.map(document => {
        if (!document._type) {
          return (
            <div key={document._id}>
              Missing <code>_type</code>
            </div>
          )
        }

        const schemaType = schema.get(document._type)

        return (
          <DefaultListItem className={styles.item} key={document._id}>
            {schemaType ? (
              <IntentLink
                className={styles.link}
                intent="edit"
                params={{id: document._id, type: document._type}}
              >
                <Preview value={document} type={schemaType} />
                {document._hasDraft && <DraftStatus />}
              </IntentLink>
            ) : (
              <div>
                A document of the unknown type <em>{document._type}</em>
              </div>
            )}
          </DefaultListItem>
        )
      })}
    </DefaultList>
  )
}
