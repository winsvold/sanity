/* eslint-disable @typescript-eslint/explicit-function-return-type */

import CloseIcon from 'part:@sanity/base/close-icon'
import Button from 'part:@sanity/components/buttons/default'
import * as React from 'react'
import styles from './ChangesInspector.css'

interface Props {
  onHistoryClose: () => void
}

function ChangesInspector(props: Props): React.ReactElement {
  const {onHistoryClose} = props

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

      <div className={styles.content}>
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
        [Diff]
        <br />
      </div>
    </div>
  )
}

export default ChangesInspector
