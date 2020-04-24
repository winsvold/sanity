/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react'

import styles from './StringDiff.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StringDiff({change}: {change: any}) {
  return (
    <div className={styles.root}>
      <div>
        <strong>{change.type.title}</strong>
      </div>
      <div className={styles.fromValue}>{change.fromValue}</div>
      <div className={styles.toValue}>{change.toValue}</div>
    </div>
  )
}
