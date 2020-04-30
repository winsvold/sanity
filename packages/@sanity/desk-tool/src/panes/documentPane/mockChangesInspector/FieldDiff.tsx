import * as React from 'react'
import {FieldDiffProvider} from './fieldDiffProvider'

import diffComponents from './diffComponents'

function FieldDiffResolver({diff, field}: any) {
  const DiffComponent = diffComponents[field.type]

  if (DiffComponent) {
    return <DiffComponent diff={diff} field={field} />
  }

  return <div>DefaultDiff</div>
}

function FieldDiff({diff, field}: any) {
  return (
    <FieldDiffProvider field={field}>
      <FieldDiffResolver diff={diff} field={field} />
    </FieldDiffProvider>
  )
}

export default FieldDiff
