import React from 'react'
import {Type} from '../types'
import PreviewSubscriber from './PreviewSubscriber'
import RenderPreviewSnapshot from './RenderPreviewSnapshot'

interface Props {
  type: Type
  fields?: string[]
  value: any
  ordering?: {}
  children?: (props: any) => React.ComponentType
  layout?: string
}

export default function SanityPreview(props: Props) {
  return <PreviewSubscriber {...props}>{RenderPreviewSnapshot}</PreviewSubscriber>
}
