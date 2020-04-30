import * as React from 'react'
import FieldDiff from './FieldDiff'

import styles from './ChangesInspector.css'

// mock data
import {documentDiff} from './mockProps'
import {postType} from './mockSchema'

function ChangesInspector(props: any) {
  const type = postType

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Changes</h3>
      </header>

      <div className={styles.diffCardList}>
        {type.fields.map(field => {
          const diff = documentDiff.fields[field.name]

          if (!diff) return null

          return (
            <div className={styles.diffCard} key={field.name}>
              <FieldDiff diff={diff.diff} field={field} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChangesInspector
