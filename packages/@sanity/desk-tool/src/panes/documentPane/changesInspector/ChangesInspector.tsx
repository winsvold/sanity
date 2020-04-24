/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/no-multi-comp */

import {isEqual} from 'lodash'
import CloseIcon from 'part:@sanity/base/close-icon'
import Button from 'part:@sanity/components/buttons/default'
import * as React from 'react'
import {Doc} from '../types'
import {FieldDiff} from './fieldDiff'

import styles from './ChangesInspector.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Schema = any

interface Props {
  documentType: string
  fromValue: Doc | null
  isLoading: boolean
  onHistoryClose: () => void
  toValue: Doc | null
  schemaType: Schema
}

function getChanges(
  schemaType: Schema,
  fromValue: Doc | null,
  toValue: Doc | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  path: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ret: any[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemaType.fields.forEach((field: any) => {
    if (field.type.name === 'object') {
      const objectChanges = getChanges(
        field.type,
        fromValue && fromValue[field.name],
        toValue && toValue[field.name],
        path.concat([field.name])
      )

      ret = ret.concat(objectChanges)
    } else {
      const _fromValue = fromValue && fromValue[field.name]
      const _toValue = toValue && toValue[field.name]

      if (!isEqual(_fromValue, _toValue)) {
        ret.push({
          type: field.type,
          path: path.concat([field.name]),
          fromValue: _fromValue,
          toValue: toValue && toValue[field.name]
        })
      }
    }
  })

  return ret
}

function ChangesInspector(props: Props): React.ReactElement {
  const {fromValue, isLoading, onHistoryClose, toValue, schemaType} = props
  const changes = getChanges(schemaType, fromValue, toValue)

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

      {!isLoading && (
        <div className={styles.content}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {changes.map((change: any, changeIndex: number) => (
            <div key={String(changeIndex)}>
              <FieldDiff change={change} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChangesInspector
