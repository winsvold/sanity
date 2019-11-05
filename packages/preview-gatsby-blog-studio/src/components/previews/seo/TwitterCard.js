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
    const {title, excerpt, mainImage} = document
    const url = assemblePostUrl(document)
    const primaryAuthor = {...placeholderAuthor, ...document.authors[0]}
    const websiteUrlWithoutProtocol = websiteUrl.split('://')[1]

    return (
      <div className={styles.seoItem}>
        <h3>Twitter card preview</h3>
        <div className={styles.tweetWrapper}>
          <div className={styles.tweetAuthor}>
            <img
              className={styles.tweetAuthorAvatar}
              src={urlFor(primaryAuthor.image)
                .width(90)
                .url()}
            />
            <span className={styles.tweetAuthorName}>{primaryAuthor.name}</span>
            <span className={styles.tweetAuthorHandle}>@{primaryAuthor.slug.current}</span>
          </div>

          <div className={styles.tweetText}>
            <p>The card for your website will look a little something like this!</p>
          </div>
          <a href={url} className={styles.tweetUrlWrapper}>
            <div className={styles.tweetCardPreview}>
              <div className={styles.tweetCardImage}>
                <img
                  src={urlFor(mainImage)
                    .width(300)
                    .url()}
                />
              </div>
              <div className={styles.tweetCardContent}>
                <h2 className={styles.tweetCardTitle}>{title}</h2>
                <div className={styles.tweetCardDescription}>{blocksToText(excerpt)}</div>
                <div className={styles.tweetCardDestination}>{websiteUrlWithoutProtocol}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    )
  }
}

export default TwitterCard
