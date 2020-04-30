import * as React from 'react'
import FieldDiffContainer from '../components/FieldDiffContainer'

import styles from './StringDiff.css'

function Segment({segment}: any) {
  if (segment.type === 'add') {
    return (
      <span className={styles.add} style={{color: 'blue'}}>
        {segment.text}
      </span>
    )
  }

  if (segment.type === 'remove') {
    return (
      <span className={styles.remove} style={{color: 'blue'}}>
        {segment.text}
      </span>
    )
  }

  return <span>{segment.text}</span>
}

function StringDiff({diff}: any) {
  return (
    <FieldDiffContainer>
      {diff.segments.map((segment, idx) => (
        <Segment key={String(idx)} segment={segment} />
      ))}
    </FieldDiffContainer>
  )
}

export default StringDiff
