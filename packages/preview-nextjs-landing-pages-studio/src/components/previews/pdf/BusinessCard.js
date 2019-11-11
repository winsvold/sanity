/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'part:@sanity/components/loading/spinner'
import sanityClient from 'part:@sanity/base/client'
import imageUrlBuilder from '@sanity/image-url'
import getIt from 'get-it'
import promise from 'get-it/lib/middleware/promise'
import styles from './BusinessCard.css'

const fileType = 'png'
const cardServiceBaseUrl = `http://localhost:3000/api/business-card?fileType=${fileType}`
const request = getIt([promise()])

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

class BusinessCard extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  state = {
    businessCardImage: null,
    error: null
  }

  componentDidMount = () => {
    const {document} = this.props
    sanityClient.fetch('*[_id == "global-config"][0]').then(siteConfig => {
      const siteLogoImageUrl = urlFor(siteConfig.logo)
        .width(500)
        .url()
      document.imageUrl = siteLogoImageUrl
      const stringifiedDoc = JSON.stringify(document)
      const cardServiceUrl = `${cardServiceBaseUrl}&document=${stringifiedDoc}&imageUrl=${siteLogoImageUrl}`

      request({url: cardServiceUrl, rawBody: true})
        .then(response => {
          const base64 = btoa(
            new Uint8Array(response.body).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
          this.setState({businessCardImage: `data:image/${fileType};base64,${base64}`})
        })
        .catch(error => {
          this.setState({error})
        })
    })
  }

  render() {
    const {document} = this.props
    const {businessCardImage, error} = this.state
    const {name} = document

    if (error) {
      return <pre>{JSON.stringify(error, null, 2)}</pre>
    }
    if (!businessCardImage) {
      return <Spinner message="Fetching business card" />
    }

    return (
      <div className={styles.root}>
        <h3>{`Here's your business card, ${name}`}</h3>
        <img className={styles.cardWrapper} src={businessCardImage} />
      </div>
    )
  }
}

export default BusinessCard
