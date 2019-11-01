import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind/ColorblindPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'

const PREVIEW_TYPES = ['book', 'author']
const PREVIEWS = [
  {
    name: 'colorblind',
    title: 'Color blindness',
    component: <ColorblindPreview url="https://css-tricks.com/newsletters/" />
  },
  {
    name: 'seo',
    title: 'SEO',
    component: <SeoPreviews />
  },
  {
    name: 'some-component',
    title: 'Some component preview',
    component: (
      <div>
        Some <strong>component</strong> preview
      </div>
    )
  }
]

export default function resolveContextualPreviews(document, rev) {
  if (!PREVIEW_TYPES.includes(document._type)) {
    return null
  }

  return PREVIEWS.map(item => {
    if (item.url) {
      const url = `${item.url}/${document._id}`
      return {...item, url: rev ? `${url}?rev=${rev}` : url}
    }
    return item
  })
}
