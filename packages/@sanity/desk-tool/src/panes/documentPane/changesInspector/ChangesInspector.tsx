import * as React from 'react'
import CloseIcon from 'part:@sanity/base/close-icon'
import Button from 'part:@sanity/components/buttons/default'
import {diffObject, FieldDiff} from '@sanity/diff'
import {ComputedDiff} from '../history'
import {SchemaType} from '../types'

import styles from './ChangesInspector.css'

interface Props {
  documentType: string
  isLoading: boolean
  onHistoryClose: () => void
  schemaType: SchemaType
  diff: ComputedDiff
}

export function ChangesInspector(props: Props): React.ReactNode {
  const {diff, isLoading, onHistoryClose, schemaType} = props
  const changes = React.useMemo(() => (diff ? diffObject(diff.from, diff.to) : undefined), [
    schemaType,
    diff
  ])

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
          <FieldDiff
            type="object"
            schemaType={schemaType}
            toValue={diff.to}
            fromValue={diff.from}
            fields={changes.fields}
            path={[]}
            isChanged
          />
        </div>
      )}
    </div>
  )
}
