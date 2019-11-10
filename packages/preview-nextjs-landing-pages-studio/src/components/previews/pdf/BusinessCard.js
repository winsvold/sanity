/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'part:@sanity/components/loading/spinner'
import getIt from 'get-it'
import promise from 'get-it/lib/middleware/promise'
import styles from './BusinessCard.css'

const cardGeneratorUrl = 'http://localhost:3000/api/business-card?fileType=png'
const request = getIt([promise()])

class BusinessCard extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  state = {
    businessCardImage: null
  }

  // TODO: materialize profileImageURL?
  // alternatively, use sanityClient on the server thingy to get the image url
  componentDidMount = () => {
    const {document} = this.props
    const url = `${cardGeneratorUrl}&document=${JSON.stringify(document)}`
    console.log('url', url)
    request({url, rawBody: true})
      .then(response => {
        const base64 = btoa(
          new Uint8Array(response.body).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        this.setState({businessCardImage: `data:image/png;base64,${base64}`})
      })
      .catch((error, response) => {
        console.error('BOOOM', error)
      })
  }

  render() {
    const {document} = this.props
    const {businessCardImage} = this.state
    const {name} = document

    return (
      <div className={styles.root}>
        <h3>BusinessCard for {name}</h3>
        {!businessCardImage && <Spinner />}
        {businessCardImage && <img className={styles.cardWrapper} src={businessCardImage} />}
      </div>
    )
  }
}

export default BusinessCard
