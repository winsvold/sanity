import React from 'react'
import {Document, Type} from '../types'
import PreviewSubscriber from './PreviewSubscriber'

function arrify(val) {
  if (Array.isArray(val)) {
    return val
  }
  return typeof val === undefined ? [] : [val]
}

type Props = {
  document: Document
  fields: string | string[]
  type: Type
  children: (snapshot: Document) => React.ReactChildren
}

export default function PreviewFields(props: Props) {
  return (
    <PreviewSubscriber value={props.document} type={props.type} fields={arrify(props.fields)}>
      {({snapshot}) => <span>{snapshot ? props.children(snapshot) : null}</span>}
    </PreviewSubscriber>
  )
}
