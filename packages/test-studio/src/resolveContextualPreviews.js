/* eslint-disable no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'

export default function resolveContextualPreviews(document) {
  return [
    {
      name: 'colorblind',
      title: 'Color blindness',
      component: <ColorblindPreview url="https://css-tricks.com" />
    },
    {
      name: 'seo',
      title: 'SEO',
      url: 'https://some-seo-url.no',
      component: <SeoPreviews document={document} />
    },
    {
      name: 'example-com',
      title: 'Example.com',
      url: 'https://example.com'
    },
    {
      name: 'author-name',
      title: 'Author Name',
      component: (
        <div>
          <h1>{document.name}</h1>
        </div>
      )
    }
  ]
}
