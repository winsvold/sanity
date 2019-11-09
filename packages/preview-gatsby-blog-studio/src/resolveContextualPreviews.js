/* eslint-disable indent, no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import TextToSpeechPreview from './components/previews/a11y/text-to-speech/TextToSpeechPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'
import {assemblePostUrl} from './utils'
import IrlPreview from './components/previews/irl-previews/IrlPreview'
import BannerExample from './components/previews/irl-previews/BannerExample'

const resolveContextualPreviews = document => {
  const isPost = document._type === 'post'
  const isAuthor = document._type === 'author'

  return [
    isPost
      ? {
          name: 'billboard-newyork-2',
          title: 'New York 2',
          component: (
            <IrlPreview position="" previewImage="/static/newyork.png">
              <BannerExample tagline={document.title} />
            </IrlPreview>
          )
        }
      : null,
    isPost
      ? {
          name: 'billboard-osaka',
          title: 'Osaka',
          component: (
            <IrlPreview
              position="width: 187px; height: 384px; left: 285px; top: 25px; transform: scale(1, 1) matrix3d(0.684027, 0.101256, 0, 0.000730198, 0.010567, 0.835693, 0, -0.000350746, 0, 0, 1, 0, -28.4262, -23.8987, 0, 1);"
              document={document}
              previewImage="/static/osaka.png"
            />
          )
        }
      : null,
    // isPost
    //   ? {
    //       name: 'text-to-speech',
    //       title: 'Text-to-Speech',
    //       component: (
    //         <TextToSpeechPreview
    //           document={document}
    //           options={{fields: ['title', 'body', 'excerpt'], rate: 1.3, pitch: 1, lang: 'nb-NO'}}
    //         />
    //       )
    //     }
    //   : null,
    isPost
      ? {
          name: 'colorblind',
          title: 'Color blindness',
          component: <ColorblindPreview url={assemblePostUrl(document)} />
        }
      : null,
    // isPost
    //   ? {
    //       name: 'website',
    //       title: 'Website',
    //       url: `${assemblePostUrl(document)}`
    //     }
    //   : null,
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
