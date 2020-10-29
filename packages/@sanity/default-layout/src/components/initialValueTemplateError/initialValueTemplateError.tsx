import {Dialog} from '@sanity/ui'
import React from 'react'

interface InitialValueTemplateErrorProps {
  errors: {message: string}[]
}

export function InitialValueTemplateError({errors}: InitialValueTemplateErrorProps) {
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
