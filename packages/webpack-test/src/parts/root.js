import config from 'config:sanity'
import React from 'react'

import styles from './root.css'

function SanityRoot() {
  return (
    <div className={styles.test}>
      <h1 className={styles.heading}>SanityRoot!!! {config.api.projectId}</h1>
    </div>
  )
}

export default SanityRoot
