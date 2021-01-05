import {Box, Flex, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Validation} from './types'
import {FormFieldValidationStatus} from './FormFieldValidationStatus'

export function FormFieldHeaderText({
  description,
  htmlFor,
  title,
  validation = [],
}: {
  description?: React.ReactNode
  htmlFor?: string
  title?: React.ReactNode
  validation?: Validation[]
}) {
  const hasValidations = validation.length > 0

  return (
    <Stack space={2}>
      <Flex>
        <Text as="label" htmlFor={htmlFor} weight="semibold" size={1}>
          {title || <em>Untitled</em>}
        </Text>

        {hasValidations && (
          <Box marginLeft={2}>
            <FormFieldValidationStatus validation={validation} />
          </Box>
        )}
      </Flex>

      {description && (
        <Text muted size={1}>
          {description}
        </Text>
      )}
    </Stack>
  )
}
