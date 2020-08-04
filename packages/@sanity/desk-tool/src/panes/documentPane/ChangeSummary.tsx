import React from 'react'
import {Annotation} from './history/types'
import {Diff, NoDiff} from '@sanity/diff'

type Props = {
  diff: Diff<Annotation> | NoDiff | null
}

export default function ChangeSummary({diff}: Props) {
  return (
    <div>
      <div>Changes</div>
    </div>
  )
}
