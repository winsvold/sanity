/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import GoogleSearchResult from './GoogleSearchResult'
import TwitterCard from './TwitterCard'
import styles from './SeoPreviews.css'

class SeoPreviews extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  render() {
    const {document} = this.props
    console.log('document', document)

    return (
      <div>
        <GoogleSearchResult document={document} />
        <TwitterCard document={document} />
      </div>
    )
  }
}

export default SeoPreviews
