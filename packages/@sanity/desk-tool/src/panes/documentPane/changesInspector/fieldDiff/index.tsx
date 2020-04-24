/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react'
import {StringDiff} from './StringDiff'

import styles from './FieldDiff.css'

const fieldDiffs = {
  string: StringDiff
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FieldDiff({change}: {change: any}) {
  const DiffComponent = fieldDiffs[change.type.name]

  if (DiffComponent) {
    return <DiffComponent change={change} />
  }

  return (
    <div className={styles.defaultDiff}>
      <div>
        <strong>
          {change.type.title} ({change.type.name})
        </strong>
      </div>
      {change.fromValue && (
        <pre className={styles.fromValue}>{JSON.stringify(change.fromValue, null, 2)}</pre>
      )}
      {change.toValue && (
        <pre className={styles.toValue}>{JSON.stringify(change.toValue, null, 2)}</pre>
      )}
    </div>
  )
}
