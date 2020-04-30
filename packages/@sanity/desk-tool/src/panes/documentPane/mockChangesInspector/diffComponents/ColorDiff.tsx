import * as React from 'react'
import FieldDiffContainer from '../components/FieldDiffContainer'

function ColorDiff({diff}: any) {
  return (
    <FieldDiffContainer>
      {diff.fromValue !== undefined && (
        <>
          <input disabled type="color" value={diff.fromValue} />
          &rarr;
        </>
      )}
      <div style={{display: 'inline-block', background: 'rgba(0, 0, 255, 0.2)'}}>
        <input disabled type="color" value={diff.toValue} />
      </div>
    </FieldDiffContainer>
  )
}

export default ColorDiff
