import React from 'react'
import {Box, Flex} from '@sanity/ui'
import {Validation} from './types'
import {FormFieldHeaderText} from './FormFieldHeaderText'

export function FormFieldHeader({
  description,
  htmlFor,
  presence,
  title,
  validation = [],
}: {
  description?: React.ReactNode
  htmlFor?: string
  presence?: React.ReactNode
  title?: React.ReactNode
  validation?: Validation[]
}) {
  return (
    <Flex align="flex-end">
      <Box flex={1} paddingY={2}>
        <FormFieldHeaderText
          description={description}
          htmlFor={htmlFor}
          title={title}
          validation={validation}
        />
      </Box>

      {presence && <Box>{presence}</Box>}
    </Flex>
  )
}
