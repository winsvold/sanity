import * as React from 'react'
import FieldDiffContainer from '../components/FieldDiffContainer'

function BooleanDiff({diff}: any) {
  return (
    <FieldDiffContainer>
      {diff.fromValue !== undefined && (
        <>
          <input disabled type="checkbox" checked={diff.fromValue} />
          &rarr;
        </>
      )}
      <div style={{display: 'inline-block', background: 'rgba(0, 0, 255, 0.2)'}}>
        <input disabled type="checkbox" checked={diff.toValue} />
      </div>
    </FieldDiffContainer>
  )
}

export default BooleanDiff
