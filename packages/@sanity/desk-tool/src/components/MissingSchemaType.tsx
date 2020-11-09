import React from 'react'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import WarningIcon from 'part:@sanity/base/warning-icon'

const getUnknownTypeFallback = (id, typeName) => ({
  title: (
    <span style={{fontStyle: 'italic'}}>
      No schema found for type &quot;
      {typeName}
      &quot;
    </span>
  ),
  subtitle: <span style={{fontStyle: 'italic'}}>Document: {id}</span>,
  media: WarningIcon
})

interface MissingSchemaTypeProps {
  layout?: 'default' | 'card' | 'media' | 'detail' | 'inline' | 'block'
  value: Record<string, any>
}

// eslint-disable-next-line react/prefer-stateless-function
export default class MissingSchemaType extends React.Component<MissingSchemaTypeProps> {
  render() {
    const {layout = 'default', value} = this.props

    return (
      <SanityDefaultPreview
        value={getUnknownTypeFallback(value._id, value._type)}
        layout={layout}
      />
    )
  }
}
