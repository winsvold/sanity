import React from 'react'
import schema from 'part:@sanity/base/schema'
import {PreviewFields} from 'part:@sanity/base/preview'

function ShowTitle({title}: {title: string}) {
  return <span>{title}</span>
}

export default function DocTitle(props: {document?: {_id: string; _type: string}}) {
  const {document} = props

  if (!document) {
    return <div>Missing document</div>
  }

  const type = schema.get(document._type)

  return (
    <PreviewFields document={document} type={type} fields={['title']}>
      {ShowTitle as any}
    </PreviewFields>
  )
}
