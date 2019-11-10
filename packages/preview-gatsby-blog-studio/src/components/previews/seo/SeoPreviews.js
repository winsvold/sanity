/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import sanityClient from 'part:@sanity/base/client'
import Spinner from 'part:@sanity/components/loading/spinner'
import GoogleSearchResult from './GoogleSearchResult'
import TwitterCard from './TwitterCard'
import FacebookShare from './FacebookShare'

const materializeAuthor = documentId => {
  return sanityClient.fetch(`*[_id == $documentId][0]{"author": authors[0].author->}`, {
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
    materializedAuthor: null
  }

  componentDidMount() {
    materializeAuthor(this.props.document._id).then(document => {
      this.setState({
        materializedAuthor: {
          name: document.author.name,
          handle: document.author.slug.current,
          image: document.author.image
        }
      })
    })
  }

  render() {
    const document = this.props.document
    if (!document) {
      return <Spinner />
    }

    return (
      <div>
        <GoogleSearchResult document={document} />
        <TwitterCard document={document} author={this.state.materializedAuthor} />
        <FacebookShare document={document} />
      </div>
    )
  }
}

export default SeoPreviews
