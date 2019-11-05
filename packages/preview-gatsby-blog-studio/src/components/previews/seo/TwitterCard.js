/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import {assemblePostUrl, blocksToText, websiteUrl} from '../../../utils'
import styles from './SeoPreviews.css'

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

const placeholderAuthor = {
  name: 'My Name',
  slug: {current: 'my-name'}
}

class TwitterCard extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  render() {
    const {document} = this.props
    const {title, body, mainImage} = document
    const url = assemblePostUrl(document)
    const primaryAuthor = {...placeholderAuthor, ...document.authors[0]}
    const websiteUrlWithoutProtocol = websiteUrl.split('://')[1]

    return (
      <div className={styles.seoItem}>
        <h3>Twitter card preview</h3>
        <div className={styles.twitterBorder}>
          <div>
            <img
              src={urlFor(primaryAuthor.image)
                .width(90)
                .url()}
            />
            <div>{primaryAuthor.name}</div>
            <div>@{primaryAuthor.slug.current}</div>
          </div>

          <div>
            <p>The card for your website will look a little something like this!</p>
          </div>

          <div>
            <a href={url}>
              <div>
                <img
                  src={urlFor(mainImage)
                    .width(90)
                    .url()}
                />
              </div>
              <div>
                <h2>{title}</h2>
                <p>{blocksToText(body).split('.')[0]}.</p>
                <span>{websiteUrlWithoutProtocol}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default TwitterCard
