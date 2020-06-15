import UndoIcon from 'part:@sanity/base/undo-icon'
import Button from 'part:@sanity/components/buttons/default'
import * as React from 'react'
import {useUndo} from '../operations/undoChange'
import {useFieldDiff} from './fieldDiffProvider'
import styles from './FieldDiffContainer.css'

export function FieldDiffContainer(props: {children: React.ReactNode}): React.ReactElement {
  const {title} = useFieldDiff()
  const undoChange = useUndo()

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <Button
          aria-label="Undo"
          className={styles.undoButton}
          icon={UndoIcon}
          kind="secondary"
          onClick={undoChange}
        />
      </header>
      <div className={styles.content}>{props.children}</div>
    </section>
  )
}
