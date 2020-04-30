import * as React from 'react'
import FieldDiff from '../FieldDiff'

import styles from './ObjectDiff.css'

function ObjectDiff({diff, field}: any) {
  return (
    <div className={styles.root}>
      <h4 className={styles.title}>{field.title}</h4>

      <div className={styles.diffCardList}>
        {field.fields.map((subField: any, idx: number) => {
          const subDiff = diff.fields[subField.name]

          if (!subDiff) return null

          return (
            <div className={styles.diffCard} key={String(idx)}>
              <FieldDiff diff={subDiff.diff} field={subField} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ObjectDiff
