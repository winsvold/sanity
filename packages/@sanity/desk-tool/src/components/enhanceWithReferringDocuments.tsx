import React from 'react'
import {WithReferringDocuments} from 'part:@sanity/base/with-referring-documents'

interface EnhancedWithReferringDocumentsProps {
  published?: Record<string, any>
}

export default function enhanceWithReferringDocuments<ComponentProps>(
  Component: React.ComponentType<ComponentProps>
) {
  function EnhancedWithReferringDocuments(
    props: ComponentProps & EnhancedWithReferringDocumentsProps
  ) {
    const renderChild = ({isLoading, referringDocuments}) => (
      <Component
        {...props}
        referringDocuments={referringDocuments}
        isCheckingReferringDocuments={isLoading}
      />
    )

    return props.published ? (
      <WithReferringDocuments id={props.published._id}>{renderChild}</WithReferringDocuments>
    ) : (
      renderChild({referringDocuments: [], isLoading: false})
    )
  }

  EnhancedWithReferringDocuments.displayName = `enhanceWithReferringDocuments(${Component.displayName ||
    Component.name})`

  return EnhancedWithReferringDocuments
}
