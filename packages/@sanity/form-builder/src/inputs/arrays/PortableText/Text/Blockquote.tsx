import {Box, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'

interface BlockquoteProps {
  children: React.ReactNode
}

const Root = styled(Box)`
  border-left: 1px solid var(--card-border-color);
`

export function Blockquote(props: BlockquoteProps) {
  const {children} = props

  return (
    <Root marginY={3} paddingLeft={3}>
      <Text as="blockquote" muted>
        {children}
      </Text>
    </Root>
  )
}
