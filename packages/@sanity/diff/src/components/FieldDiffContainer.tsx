import UndoIcon from 'part:@sanity/base/undo-icon'
import * as React from 'react'
import {useFieldDiff} from './fieldDiffProvider'
import styles from './FieldDiffContainer.css'

export function FieldDiffContainer(props: {children: React.ReactNode}): React.ReactElement {
  const {title} = useFieldDiff()

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <UndoIcon />
      </header>
      <div className={styles.content}>{props.children}</div>
    </section>
  )
}
