import {DocumentIcon, FolderIcon} from '@sanity/icons'
import PropTypes from 'prop-types'
import React from 'react'
import schema from 'part:@sanity/base/schema'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import DocumentPaneItemPreview from '../../components/DocumentPaneItemPreview'
import getIconWithFallback from '../../utils/getIconWithFallback'
import MissingSchemaType from '../../components/MissingSchemaType'
import PaneItemWrapper from './PaneItemWrapper'

export default function PaneItem(props) {
  const {id, isSelected, schemaType, layout, icon, value} = props
  const useGrid = layout === 'card' || layout === 'media'

  const hasSchemaType = schemaType && schemaType.name && schema.get(schemaType.name)

  let preview
  if (value && value._id) {
    preview = hasSchemaType ? (
      <DocumentPaneItemPreview
        icon={getIconWithFallback(icon, schemaType, DocumentIcon)}
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
        icon={getIconWithFallback(icon, schemaType, FolderIcon)}
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

PaneItem.propTypes = {
  id: PropTypes.string.isRequired,
  layout: PropTypes.string,
  isSelected: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  value: PropTypes.shape({
    _id: PropTypes.string,
    _type: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    media: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  }),
  schemaType: PropTypes.shape({
    name: PropTypes.string,
    icon: PropTypes.func,
  }),
}

PaneItem.defaultProps = {
  layout: 'default',
  icon: undefined,
  value: null,
  isSelected: false,
  schemaType: null,
}
