/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state */
import React from 'react'
import PropTypes from 'prop-types'
import styles from './SeoPreviews.css'

class SeoPreviews extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    document: null
  }

  state = {
    activeTab: null
  }

  componentDidMount() {}

  render() {
    return <div>HELLO</div>
  }
}

export default SeoPreviews
