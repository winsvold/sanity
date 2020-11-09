import React from 'react'
import schema from 'part:@sanity/base/schema'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import folderIcon from 'part:@sanity/base/folder-icon'
import fileIcon from 'part:@sanity/base/file-icon'
import DocumentPaneItemPreview from '../DocumentPaneItemPreview'
import getIconWithFallback from '../../utils/getIconWithFallback'
import MissingSchemaType from '../MissingSchemaType'
import {PreviewValue, ResolvedSchema} from '../../types'
import PaneItemWrapper from './PaneItemWrapper'

interface PaneItemProps {
  icon?: React.ComponentType | boolean
  id: string
  isSelected: boolean
  // @todo
  schemaType: ResolvedSchema
  layout: 'card' | 'default' | 'media'
  // @todo
  value?: PreviewValue
}

export default function PaneItem(props: PaneItemProps) {
  const {id, isSelected = false, schemaType, layout = 'default', icon, value = null} = props
  const useGrid = layout === 'card' || layout === 'media'

  const hasSchemaType = schemaType && schemaType.name && schema.get(schemaType.name)

  let preview
  if (value && value._id) {
    preview = hasSchemaType ? (
      <DocumentPaneItemPreview
        icon={getIconWithFallback(icon, schemaType, fileIcon)}
        layout={layout}
        schemaType={schemaType}
        value={value}
      />
    ) : (
      <MissingSchemaType value={value} />
    )
  } else {
    preview = (
      <SanityDefaultPreview
        icon={getIconWithFallback(icon, schemaType, folderIcon)}
        layout={layout}
        value={value}
      />
    )
  }

  return (
    <PaneItemWrapper id={id} isSelected={isSelected} layout={layout} useGrid={useGrid}>
      {preview}
    </PaneItemWrapper>
  )
}
