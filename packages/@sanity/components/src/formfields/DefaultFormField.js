/* eslint-disable complexity */

import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@sanity/components/formfields/default-style'
import ValidationStatus from 'part:@sanity/components/validation/status'
import ValidationList from 'part:@sanity/components/validation/list'
// import AnimateHeight from 'react-animate-height'
import {Heading, Text} from '@sanity/ui'

function FieldHeader(props) {
  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <label className={styles.label} htmlFor={props.labelFor}>
          <Heading as="div" size={2}>
            {props.label}
          </Heading>
        </label>

        {props.description && (
          <div className={styles.description}>
            <Text as="p" size={1}>
              {props.description}
            </Text>
          </div>
        )}
      </div>

      <div className={styles.headerStatus}>
        <div onClick={props.onToggleValidation} className={styles.validationStatus}>
          <ValidationStatus markers={props.markers} />
        </div>
      </div>

      <div contentClassName={styles.validationList}>
        <ValidationList markers={props.markers} />
      </div>
    </div>
  )
}

// eslint-disable-next-line react/no-multi-comp
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

    const className = `
      ${inline ? styles.inline : styles.block}
      ${wrapped ? styles.wrapped : ''}
      ${classNameProp || ''}
    `

    return (
      <div className={className}>
        {label && (
          <FieldHeader
            description={description}
            label={label}
            labelFor={labelFor}
            markers={markers}
            onToggleValidation={this.handleToggleShowValidation}
          />
        )}

        <div className={styles.content}>{children}</div>
      </div>
    )
  }
}
