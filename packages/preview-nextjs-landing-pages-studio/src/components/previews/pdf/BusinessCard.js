/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import {styles} from './BusinessCard.css'

class BusinessCard extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  render() {
    const {document} = this.props
    const {name} = document

    return (
      <div className={styles.root}>
        <h3>BusinessCard</h3>
        <div>sup, {name}</div>
      </div>
    )
  }
}

export default BusinessCard
