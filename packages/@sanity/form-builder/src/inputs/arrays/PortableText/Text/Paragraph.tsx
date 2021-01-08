import {Box, Text} from '@sanity/ui'
import React from 'react'

interface ParagraphProps {
  children: React.ReactNode
}

export function Paragraph(props: ParagraphProps) {
  const {children} = props

  return (
    <Box marginY={4}>
      <Text muted size={[2, 3]}>
        {children}
      </Text>
    </Box>
  )
}
