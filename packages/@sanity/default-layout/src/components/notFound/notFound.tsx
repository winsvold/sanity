import {Box, Card, Container, Heading, Icon, Stack} from '@sanity/ui'
import React from 'react'
import {useRouterState} from 'part:@sanity/base/router'
import styled from 'styled-components'
import {StateButton} from '../stateButton'
import {HAS_SPACES} from '../../lib/__experimental_spaces'

const Root = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export function NotFound(props: React.HTMLProps<HTMLDivElement>) {
  const {children, ...restProps} = props
  const routerState = useRouterState()
  const rootState = {space: HAS_SPACES ? routerState?.space : undefined}

  return (
    <Root {...restProps}>
      <Container width={1}>
        <Box paddingX={5} paddingY={4}>
          <Stack space={4}>
            <Heading as="h1">Page not found</Heading>
            {children}
          </Stack>
        </Box>

        <Box paddingX={5} paddingY={4}>
          <StateButton state={rootState} tone="brand">
            Go to index&nbsp; <Icon symbol="arrow-right" />
          </StateButton>
        </Box>
      </Container>
    </Root>
  )
}
