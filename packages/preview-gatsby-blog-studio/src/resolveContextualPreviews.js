/* eslint-disable indent, no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import TextToSpeechPreview from './components/previews/a11y/text-to-speech/TextToSpeechPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'
import {assemblePostUrl} from './utils'
import IrlPreview from './components/previews/irl-previews/IrlPreview'

const resolveContextualPreviews = document => {
  const isPost = document._type === 'post'
  const isAuthor = document._type === 'author'

  return [
    isPost
      ? {
          name: 'billboard-newyork',
          title: 'Times Square',
          component: (
            <IrlPreview position="background: rgb(36, 87, 114); height: 156px; width: 467px;left: 86px; top: 172px; transform: scale(1.0059, 1.01289) matrix3d(0.16931, -0.265774, 0, -0.00165839, -0.0339945, 0.636538, 0, -0.000462379, 0, 0, 1, 0, 141.494, -12.404, 0, 1);" document={document} previewImage="/static/newyork2.jpg" />
          )
        }
      : null,
    isPost
      ? {
          name: 'billboard-osaka',
          title: 'Osaka',
          component: <IrlPreview position="background: rgb(36, 87, 114); width: 187px; height: 384px; left: 285px; top: 25px; font-size: 1.3rem; color: black; display: flex; align-items: center; text-align: center; font-weight: bold; transform: scale(1, 1) matrix3d(0.684027, 0.101256, 0, 0.000730198, 0.010567, 0.835693, 0, -0.000350746, 0, 0, 1, 0, -28.4262, -23.8987, 0, 1);" document={document} previewImage="/static/osaka.png" />
        }
      : null,
    isPost
      ? {
          name: 'billboard-newyork-2',
          title: 'New York 2',
          component: (
            <IrlPreview position="background: rgb(36, 87, 114); width: 392px; height: 238px; left: 47px; top: 112px; font-size: 1.3rem; color: white; display: flex; align-items: center; text-align: center; font-weight: bold; transform: scale(1, 1) matrix3d(0.786713, 0.180528, 0, 0.000450564, -0.0499065, 0.730603, 0, -0.000410337, 0, 0, 1, 0, 80.4607, -30.8489, 0, 1);" document={document} previewImage="/static/newyork.png" />
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
