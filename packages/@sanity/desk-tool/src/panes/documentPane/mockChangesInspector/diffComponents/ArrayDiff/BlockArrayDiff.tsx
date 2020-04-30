import {get} from 'lodash'
import * as React from 'react'
import FieldDiffContainer from '../../components/FieldDiffContainer'

function BlockArrayItem({action, fromValue}: any) {
  if (action.type === 'update') {
    const val = get(fromValue, action.path.join('.'))

    return <div>{JSON.stringify(val)}</div>
  }

  return <div>{action.type}</div>
}

function BlockArrayDiff({diff}: any) {
  return (
    <FieldDiffContainer>
      {diff.actions.map((action, idx) => (
        <BlockArrayItem action={action} fromValue={diff.fromValue} key={String(idx)} />
      ))}
    </FieldDiffContainer>
  )
}

export default BlockArrayDiff
