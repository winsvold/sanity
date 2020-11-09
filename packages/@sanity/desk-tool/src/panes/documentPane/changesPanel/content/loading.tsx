import {Spinner} from '@sanity/base/__legacy/components'
import React from 'react'

import styles from './loading.css'

export function LoadingContent() {
  return (
    <div className={styles.root}>
      <Spinner center className={styles.spinner} message="Loading changes…" />
    </div>
  )
}
