import {PortableTextBlock} from '@sanity/portable-text-editor'
import {Box, Heading} from '@sanity/ui'
import React from 'react'

interface HeaderProps {
  block: PortableTextBlock
  children: React.ReactNode
}

const STYLE_SIZES = {
  h1: [4, 5],
  h2: [3, 4],
  h3: [2, 3],
  h4: [1, 2],
  h5: [0, 1],
  h6: [0, 0],
}

export function Header(props: HeaderProps) {
  const {block, children} = props

  return (
    <Box data-style={block.style} marginTop={5} marginBottom={3}>
      <Heading size={STYLE_SIZES[block.style] || 1}>{children}</Heading>
    </Box>
  )
}
