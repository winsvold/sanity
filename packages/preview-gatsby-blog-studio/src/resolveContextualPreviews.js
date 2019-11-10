/* eslint-disable indent, no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import TextToSpeechPreview from './components/previews/a11y/text-to-speech/TextToSpeechPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'
import {assemblePostUrl} from './utils'

const resolveContextualPreviews = document => {
  const isPost = document._type === 'post'
  const isAuthor = document._type === 'author'

  return [
    isPost
      ? {
          name: 'text-to-speech',
          title: 'Text-to-Speech',
          component: (
            <TextToSpeechPreview
              document={document}
              options={{fields: ['title', 'body', 'excerpt'], rate: 1.3, pitch: 1, lang: 'nb-NO'}}
            />
          )
        }
      : null,
    isPost
      ? {
          name: 'colorblind',
          title: 'Color blindness',
          component: <ColorblindPreview url={assemblePostUrl(document)} />
        }
      : null,
    isPost
      ? {
          name: 'website',
          title: 'Website',
          url: `${assemblePostUrl(document)}`
        }
      : null,
    isPost
      ? {
          name: 'seo',
          title: 'SEO',
          component: <SeoPreviews document={document} />
        }
      : null
  ].filter(Boolean)
}

export default resolveContextualPreviews
