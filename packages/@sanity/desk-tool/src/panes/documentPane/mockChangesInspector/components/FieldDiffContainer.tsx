import * as React from 'react'
import {useFieldDiff} from '../fieldDiffProvider'

import styles from './FieldDiffContainer.css'

function FieldDiffContainer(props: any) {
  const {field} = useFieldDiff()

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h4 className={styles.title}>{field.title}</h4>
      </header>
      <div className={styles.content}>{props.children}</div>
    </section>
  )
}

export default FieldDiffContainer
