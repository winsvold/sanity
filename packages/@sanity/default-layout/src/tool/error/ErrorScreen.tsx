import {Box, Button, Card, Code, Container, Heading, Inline} from '@sanity/ui'
import React from 'react'
import {formatStack, getErrorWithStack, limitStackLength} from './helpers'

interface Props {
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

export function ErrorScreen(props: Props) {
  const {activeTool, error, info, onRetry, onShowDetails, showErrorDetails} = props
  const toolName = (activeTool && (activeTool.title || activeTool.name)) || 'active'

  return (
    <Card padding={4} tone="transparent">
      <Container width={2}>
        <Card padding={4} shadow={2}>
          <Box as="header">
            <Heading as="h2" size={2}>
              The ‘{toolName}’ tool crashed
            </Heading>
          </Box>

          <Box>
            <Inline space={3}>
              <Button onClick={onRetry}>Retry</Button>
              <Button onClick={onShowDetails} disabled={showErrorDetails}>
                Show details
              </Button>
            </Inline>
          </Box>
        </Card>
      </Container>

      {showErrorDetails && (
        <>
          <Heading as="h3" size={1}>
            Stack trace:
          </Heading>
          <Card padding={3} style={{overflow: 'auto'}}>
            <Code>{formatStack(limitStackLength(getErrorWithStack(error)))}</Code>
          </Card>

          <Heading as="h3" size={1}>
            Component stack:
          </Heading>
          <Card padding={3} style={{overflow: 'auto'}}>
            <Code>{info.componentStack.replace(/^\s*\n+/, '')}</Code>
          </Card>
        </>
      )}
    </Card>
  )
}
