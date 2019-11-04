/* eslint-disable no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'

export default function resolveContextualPreviews(document) {
  return [
    {
      name: 'colorblind',
      title: 'Color blindness',
      component: () => <ColorblindPreview url="https://css-tricks.com" />
    },
    {
      name: 'example.com',
      title: 'example.com',
      url: `https://example.com/${document._id}`
    },
    {
      name: 'seo',
      title: 'SEO',
      component: () => <SeoPreviews document={document} />
    },
    {
      name: 'author-name',
      title: 'Author Name',
      component: () => (
        <div>
          <h1 style={{background: 'linear-gradient(#e66465, #9198e5)'}}>{document.name}</h1>
        </div>
      )
    }
  ]
}
