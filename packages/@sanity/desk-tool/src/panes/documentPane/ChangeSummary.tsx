import React from 'react'
import {Annotation} from './history/types'
import {Diff, NoDiff} from '@sanity/diff'
import {FieldDiff} from '../../components/diffs/FieldDiff'
import {SchemaType} from './types'

type Props = {
  diff: Diff<Annotation> | NoDiff | null
  schemaType: SchemaType
}

export default function ChangeSummary({diff, schemaType}: Props) {
  console.log(diff)
  return <FieldDiff {...diff} schemaType={schemaType} />
}
