/* eslint-disable indent, no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'
import {assemblePostUrl} from './utils'

const resolveContextualPreviews = document => {
  const isPost = document._type === 'post'
  const isAuthor = document._type === 'author'

  return [
    isPost
      ? {
          name: 'colorblind',
          title: 'Color blindness',
          component: (
            <ColorblindPreview
              url={`https://preview-gatsby-blog.netlify.com/${assemblePostUrl(document)}`}
            />
          )
        }
      : null,
    isPost
      ? {
          name: 'web-frontend',
          title: 'Web frontend',
          url: `https://preview-gatsby-blog.netlify.com/${assemblePostUrl(document)}`
        }
      : null,
    {
      name: 'seo',
      title: 'SEO',
      component: <SeoPreviews document={document} />
    },
    isAuthor
      ? {
          name: 'author-name',
          title: 'Author Name',
          types: ['author'],
          component: (
            <div>
              <h1 style={{background: 'linear-gradient(#e66465, #9198e5)'}}>{document.name}</h1>
            </div>
          )
        }
      : null
  ].filter(Boolean)
}

export default resolveContextualPreviews
