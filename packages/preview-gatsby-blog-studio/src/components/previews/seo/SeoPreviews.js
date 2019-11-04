/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import SerpPreview from 'react-serp-preview'
import {assemblePostUrl} from '../../../utils'
import styles from './SeoPreviews.css'

const renderGoogleSearchResult = document => {
  const url = assemblePostUrl(document)
  return (
    <SerpPreview
      title={document.title}
      metaDescription={`Example Domain. This domain is established to be used for
illustrative examples in documents. You may use this domain in examples
without prior coordination or asking for permission.`}
      url={url}
    />
  )
}

class SeoPreviews extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  render() {
    const {document} = this.props

    return <div>{renderGoogleSearchResult(document)}</div>
  }
}

export default SeoPreviews
