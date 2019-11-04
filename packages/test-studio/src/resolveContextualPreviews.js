/* eslint-disable no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'

const PREVIEW_TYPES = ['book', 'author']
const PREVIEWS = [
  {
    name: 'colorblind',
    title: 'Color blindness',
    component: props => <ColorblindPreview {...props} />,
    options: {
      url: 'https://css-tricks.com'
    }
  },
  {
    name: 'seo',
    title: 'SEO',
    baseUrl: 'https://some-seo-url.no',
    component: props => <SeoPreviews {...props} />
  },
  {
    name: 'example-com',
    title: 'Example.com',
    baseUrl: 'https://example.com'
  },
  {
    name: 'author-name',
    title: 'Author Name',
    component: props => (
      <div>
        <h1>{props.document.name}</h1>
      </div>
    )
  }
]

export default function resolveContextualPreviews(document, rev) {
  if (!document) {
    console.warn('No document to resolve preview from')
    return []
  }
  if (!PREVIEW_TYPES.includes(document._type)) {
    console.warn('Document is of unwanted _type. If you want to preview, that is.')
    return []
  }
  return PREVIEWS.map(item => {
    if (item.baseUrl) {
      const url = `${item.baseUrl}/${document._id}`
      return {...item, url: rev ? `${url}?rev=${rev}` : url}
    }
    return item
  })
}
