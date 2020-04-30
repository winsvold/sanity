import * as React from 'react'
import FieldDiffContainer from '../components/FieldDiffContainer'

import styles from './DateDiff.css'

function DateDiff({diff}: any) {
  return (
    <FieldDiffContainer>
      {diff.fromValue !== undefined && (
        <>
          <span>{diff.fromValue}</span>
          &rarr;
        </>
      )}
      <span className={styles.set} style={{background: `rgba(0, 0, 255, 0.2)`}}>
        <span>{diff.toValue}</span>
      </span>
    </FieldDiffContainer>
  )
}

export default DateDiff
