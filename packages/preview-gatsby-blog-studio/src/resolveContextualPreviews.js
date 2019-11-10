/* eslint-disable indent, no-console, react/no-multi-comp, react/display-name, react/prop-types */
import React from 'react'
import ColorblindPreview from './components/previews/a11y/colorblind-filter/ColorblindPreview'
import TextToSpeechPreview from './components/previews/a11y/text-to-speech/TextToSpeechPreview'
import SeoPreviews from './components/previews/seo/SeoPreviews'
import {assemblePostUrl} from './utils'
import IrlPreview from './components/previews/irl-previews/IrlPreview'
import NewyorkBanner from './components/previews/irl-previews/NewyorkBanner'
import OsakaBanner from './components/previews/irl-previews/OsakaBanner'

const newyorkStyles = {
  transform:
    'scale(1.16485, 1.16485) matrix3d(0.827658, 0.201854, 0, 0.000572104, -0.0151594, 0.713259, 0, -0.000307195, 0, 0, 1, 0, -8.84197, -23.6928, 0, 1)',
  top: '126px',
  left: '179px',
  width: '306px',
  height: '206px'
}

const osakaStyles = {
  width: '187px',
  height: '384px',
  left: '285px',
  top: '25px',
  transform:
    'scale(1, 1) matrix3d(0.684027, 0.101256, 0, 0.000730198, 0.010567, 0.835693, 0, -0.000350746, 0, 0, 1, 0, -28.4262, -23.8987, 0, 1)'
}

const resolveContextualPreviews = document => {
  const isPost = document._type === 'post'
  const isAuthor = document._type === 'author'

  return [
    isPost
      ? {
          name: 'newyork-banner',
          title: 'New York',
          component: (
            // IrlPreview handles moving, scaling, rotating, and warping
            // of the child. The child is the preview itself.
            <IrlPreview initialStyles={newyorkStyles} backgroundImage="/static/newyork.png">
              <NewyorkBanner tagline={document.title} />
            </IrlPreview>
          )
        }
      : null,
    isPost
      ? {
          name: 'osaka-banner',
          title: 'Osaka',
          component: (
            <IrlPreview initialStyles={osakaStyles} backgroundImage="/static/osaka.png">
              <OsakaBanner tagline={document.title} />
            </IrlPreview>
          )
        }
      : null,
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
