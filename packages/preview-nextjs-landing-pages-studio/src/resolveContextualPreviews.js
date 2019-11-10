/* eslint-disable indent, no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import BusinessCard from './components/previews/pdf/BusinessCard'

const resolveContextualPreviews = document => {
  const isPerson = document._type === 'person'
  return [
    isPerson
      ? {
          name: 'business-card',
          title: 'Business Card',
          component: <BusinessCard document={document} />
        }
      : null
  ].filter(Boolean)
}

export default resolveContextualPreviews
