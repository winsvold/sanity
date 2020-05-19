/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/no-multi-comp */

import CloseIcon from 'part:@sanity/base/close-icon'
import Button from 'part:@sanity/components/buttons/default'
import * as React from 'react'
import {ComputedDiff} from '../history'
import {SchemaType} from '../types'
import {getDocumentDiff} from './documentDiff'

import styles from './ChangesInspector.css'

interface Props {
  documentType: string
  isLoading: boolean
  onHistoryClose: () => void
  schemaType: SchemaType
  diff: ComputedDiff
}

function ChangesInspector(props: Props): React.ReactElement {
  const {diff, isLoading, onHistoryClose, schemaType} = props
  const changes = React.useMemo(() => getDocumentDiff(schemaType, diff), [schemaType, diff])

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.title}>Changes</div>

        <div className={styles.actions}>
          <Button
            onClick={onHistoryClose}
            title="Close"
            icon={CloseIcon}
            bleed
            kind="simple"
            className={styles.closeButton}
          />
        </div>
      </header>

      {!isLoading && changes && (
        <div className={styles.content}>
          {Object.keys(changes.fields).map((fieldName: string, changeIndex: number) => (
            <pre key={String(changeIndex)}>
              {JSON.stringify(changes.fields[fieldName], null, 2)}
            </pre>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChangesInspector
