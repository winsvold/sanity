/* eslint-disable indent, no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import BusinessCard from './components/previews/pdf/BusinessCard'

const resolveContextualPreviews = document => {
  return [
    {
      name: 'business-card',
      title: 'Business Card',
      component: <BusinessCard document={document} />
    }
  ].filter(Boolean)
}

export default resolveContextualPreviews
