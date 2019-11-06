/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import SerpPreview from 'react-serp-preview'
import {assemblePostUrl} from '../../../utils'
import styles from './SeoPreviews.css'

class GoogleSearchResult extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  render() {
    const {document} = this.props
    const {title} = document
    const url = assemblePostUrl(document)
    return (
      <div className={styles.seoItem}>
        <h3>Google search result preview</h3>
        <div className={styles.googleBorder}>
          <SerpPreview title={title} metaDescription={url} url={url} />
        </div>
      </div>
    )
  }
}

export default GoogleSearchResult
