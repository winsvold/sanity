import {Dialog} from '@sanity/ui'
import PropTypes from 'prop-types'
import React from 'react'

export function InitialValueTemplateError({errors}) {
  return (
    <Dialog
      id="initial-value-template-error-dialog"
      header="Initial value template error"
      width={4}
    >
      <p>Failed to load initial value templates:</p>
      {errors.map((error: Error) => (
        <p key={error.message}>
          <code>{error.message}</code>
        </p>
      ))}
    </Dialog>
  )
}

InitialValueTemplateError.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired
    })
  ).isRequired
}
