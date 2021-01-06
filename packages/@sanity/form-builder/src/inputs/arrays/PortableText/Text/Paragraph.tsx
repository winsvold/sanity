import {Box, Text} from '@sanity/ui'
import React from 'react'

interface Props {
  children: React.ReactNode
}

export function Paragraph(props: Props) {
  return (
    <Box marginY={4}>
      <Text>{props.children}</Text>
    </Box>
  )
}
