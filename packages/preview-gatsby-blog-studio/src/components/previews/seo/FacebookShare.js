/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import {blocksToText, websiteUrl} from '../../../utils'
import styles from './SeoPreviews.css'

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

class FacebookShare extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  render() {
    const {document} = this.props
    const {title, excerpt, mainImage} = document
    const websiteUrlWithoutProtocol = websiteUrl.split('://')[1]

    return (
      <div className={styles.seoItem}>
        <h3>Facebook share</h3>
        <div className={styles.facebookWrapper}>
          <div className={styles.facebookImageContainer}>
            <img
              className={styles.facebookCardImage}
              src={urlFor(mainImage)
                .width(500)
                .url()}
            />
          </div>
          <div className={styles.facebookCardContent}>
            <div className={styles.facebookCardUrl}>{websiteUrlWithoutProtocol}</div>
            <div className={styles.facebookCardTitle}>
              <a href={websiteUrl}>{title}</a>
            </div>
            <div className={styles.facebookCardDescription}>{blocksToText(excerpt)}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default FacebookShare
