/* eslint-disable complexity */

import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@sanity/components/formfields/default-style'
import ValidationStatus from 'part:@sanity/components/validation/status'
import ValidationList from 'part:@sanity/components/validation/list'
// import AnimateHeight from 'react-animate-height'
import {Heading, Text} from '@sanity/ui'

export default class DefaultFormField extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    inline: PropTypes.bool,
    description: PropTypes.string,
    level: PropTypes.number,
    children: PropTypes.node,
    wrapped: PropTypes.bool,
    labelFor: PropTypes.string,
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string
      })
    )
  }

  static defaultProps = {
    level: 1,
    markers: []
  }

  // state = {
  //   showValidationMessages: false
  // }

  // handleToggleShowValidation = event => {
  //   this.setState(prevState => ({
  //     showValidationMessages: !prevState.showValidationMessages
  //   }))
  // }

  render() {
    const {
      level,
      label,
      labelFor,
      description,
      children,
      inline,
      wrapped,
      className: classNameProp,
      markers
    } = this.props

    // const {showValidationMessages} = this.state

    const levelClass = `level_${level}`

    const className = `
      ${inline ? styles.inline : styles.block}
      ${styles[levelClass] || ''}
      ${wrapped ? styles.wrapped : ''}
      ${classNameProp || ''}
    `

    return (
      <div className={className}>
        {label && (
          <div className={styles.header}>
            <div className={styles.headerMain}>
              <label className={styles.label} htmlFor={labelFor}>
                {label && (
                  <Heading as="div" size={2}>
                    {label}
                  </Heading>
                )}
              </label>

              {description && (
                <div className={styles.description}>
                  <Text as="p" size={1}>
                    {description}
                  </Text>
                </div>
              )}
            </div>

            <div className={styles.headerStatus}>
              <div onClick={this.handleToggleShowValidation} className={styles.validationStatus}>
                <ValidationStatus markers={markers} />
              </div>
            </div>
          </div>
        )}

        <div contentClassName={styles.validationList}>
          <ValidationList markers={markers} />
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    )
  }
}
