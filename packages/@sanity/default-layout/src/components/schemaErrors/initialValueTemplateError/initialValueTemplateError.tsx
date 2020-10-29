import {Box, Card, Code, Dialog, Stack, Text} from '@sanity/ui'
import React from 'react'

interface InitialValueTemplateErrorProps {
  errors: {message: string}[]
}

export function InitialValueTemplateError({errors}: InitialValueTemplateErrorProps) {
  return (
    <Dialog
      id="initial-value-template-error-dialog"
      header="Initial value template error"
      width={2}
    >
      <Box padding={4}>
        <Stack space={3}>
          <Text>Failed to load initial value templates:</Text>

          {errors.map((error: Error) => (
            <Card key={error.message} padding={3} radius={2} tone="transparent">
              <Code>{error.message}</Code>
            </Card>
          ))}
        </Stack>
      </Box>
    </Dialog>
  )
}
