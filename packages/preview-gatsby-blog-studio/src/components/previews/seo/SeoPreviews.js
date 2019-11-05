/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import sanityClient from 'part:@sanity/base/client'
import Spinner from 'part:@sanity/components/loading/spinner'
import GoogleSearchResult from './GoogleSearchResult'
import TwitterCard from './TwitterCard'
import FacebookShare from './FacebookShare'
import styles from './SeoPreviews.css'

const materializeDocument = documentId => {
  return sanityClient.fetch(`*[_id == $documentId][0]{..., "authors": authors[].author->}`, {
    documentId
  })
}

class SeoPreviews extends React.PureComponent {
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
    console.log('document', document)

    return (
      <div>
        <GoogleSearchResult document={document} />
        <TwitterCard document={document} />
        <FacebookShare document={document} />
      </div>
    )
  }
}

export default SeoPreviews
