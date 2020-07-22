import React from 'react'
import {Annotation} from './history/types'
import {Diff} from '@sanity/diff'

type Props = {
  diff: Diff<Annotation> | null
}

export default function ChangeSummary({diff}: Props) {
  return (
    <div>
      <div>Changes</div>
    </div>
  )
}
