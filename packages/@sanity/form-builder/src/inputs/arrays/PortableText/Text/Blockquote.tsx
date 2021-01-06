import {Box, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'

type Props = {
  children: React.ReactNode
}

const Root = styled(Box)`
  border-left: 1px solid var(--card-border-color);
`

export function Blockquote(props: Props) {
  return (
    <Root marginY={3} paddingLeft={3}>
      <Text as="blockquote" muted>
        {props.children}
      </Text>
    </Root>
  )
}
