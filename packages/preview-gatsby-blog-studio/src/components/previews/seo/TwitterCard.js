/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import Spinner from 'part:@sanity/components/loading/spinner'
import {assemblePostUrl, blocksToText, websiteUrl} from '../../../utils'
import styles from './SeoPreviews.css'

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

const materializeDocument = documentId => {
  return sanityClient.fetch(`*[_id == $documentId][0]{..., "authors": authors[].author->}`, {
    documentId
  })
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

  state = {
    materializedDocument: null
  }

  static async getDerivedStateFromProps(props, state) {
    const newState = await materializeDocument(props.document._id).then(materializedDocument => ({
      materializedDocument
    }))
    return newState
  }

  componentDidMount() {
    materializeDocument(this.props.document._id).then(materializedDocument =>
      this.setState({materializedDocument})
    )
  }

  render() {
    const document = this.state.materializedDocument
    if (!document) {
      return <Spinner />
    }
    console.log('-------->', document)
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
