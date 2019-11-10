import React from 'react'
import PropTypes from 'prop-types'
import styles from './OsakaBanner.css'

class OsakaBanner extends React.PureComponent {
  static propTypes = {
    tagline: PropTypes.string
  }

  static defaultProps = {
    tagline: ''
  }

  render() {
    const {tagline} = this.props
    return (
      <div className={styles.banner}>
        <div className={styles.imageWrapper}>
          <img className={styles.bannerImage} src="/static/example1.png" />
        </div>
        <div className={styles.taglineWrapper}>
          <span className={styles.tagline}>{tagline}</span>
        </div>
      </div>
    )
  }
}

export default OsakaBanner
