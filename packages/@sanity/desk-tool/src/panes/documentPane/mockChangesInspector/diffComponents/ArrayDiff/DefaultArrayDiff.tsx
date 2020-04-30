import * as React from 'react'
import FieldDiffContainer from '../../components/FieldDiffContainer'

function ArrayDiffItem({action}: any) {
  if (action.type === 'insert') {
    return (
      <div style={{color: 'blue'}}>
        #{action.index}: {JSON.stringify(action.value)}
      </div>
    )
  }

  if (action.type === 'remove') {
    return (
      <div style={{color: 'blue', textDecoration: 'line-through'}}>
        #{action.index}: {JSON.stringify(action.value)}
      </div>
    )
  }

  if (action.type === 'move') {
    return (
      <div style={{color: 'blue'}}>
        #{action.fromIndex}&rarr;{action.toIndex}: {JSON.stringify(action.value)}
      </div>
    )
  }

  return <div>{action.type}</div>
}

function DefaultArrayDiff({diff}: any) {
  return (
    <FieldDiffContainer>
      {diff.actions.map((action, idx) => {
        return <ArrayDiffItem action={action} key={String(idx)} />
      })}
    </FieldDiffContainer>
  )
}

export default DefaultArrayDiff
