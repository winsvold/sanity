import {Box, Button, Card, Code, Container, Heading, Inline, Label, Stack} from '@sanity/ui'
import React from 'react'
import {formatStack, getErrorWithStack, limitStackLength} from './helpers'

interface ErrorScreenProps {
  activeTool?: {
    name: string
    title: string
  }
  error: {
    message: string
    stack: string
  }
  info: {
    componentStack: string
  }
  onRetry: () => void
  onShowDetails: () => void
  showErrorDetails: boolean
}

export function ErrorScreen(props: ErrorScreenProps) {
  const {activeTool, error, info, onRetry, onShowDetails, showErrorDetails} = props
  const toolName = activeTool && (activeTool.title || activeTool.name)

  return (
    <Card>
      <Container width={1}>
        <Box paddingX={5} paddingTop={[5, 6, 7, 8]} paddingBottom={5}>
          <Box as="header">
            <Stack space={4}>
              {toolName && (
                <Heading as="h1">
                  The <em>{toolName}</em> tool crashed
                </Heading>
              )}

              {!toolName && <Heading>The application crashed</Heading>}

              <Inline space={3}>
                <Button onClick={onRetry} tone="brand">
                  Retry
                </Button>
                <Button onClick={onShowDetails} disabled={showErrorDetails}>
                  Show details
                </Button>
              </Inline>
            </Stack>
          </Box>
        </Box>

        {showErrorDetails && (
          <Box padding={5}>
            <Stack space={5}>
              <Stack space={3}>
                <Label as="h3" size={1}>
                  Stack trace
                </Label>
                <Card padding={3} radius={2} style={{overflow: 'auto'}} tone="transparent">
                  <Code>{formatStack(limitStackLength(getErrorWithStack(error)))}</Code>
                </Card>
              </Stack>

              <Stack space={3}>
                <Label as="h3" size={1}>
                  Component stack
                </Label>

                <Card padding={3} radius={2} style={{overflow: 'auto'}} tone="transparent">
                  <Code>{info.componentStack.replace(/^\s*\n+/, '')}</Code>
                </Card>
              </Stack>
            </Stack>
          </Box>
        )}
      </Container>
    </Card>
  )
}
