import {ErrorBoundary} from '@sanity/base'
import tools from 'all:part:@sanity/base/tool'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {ErrorScreen} from './error'

declare const __DEV__: boolean

interface Props {
  tool: string
}

const DEBUG = false // __DEV__

export function RenderTool(props: Props) {
  const {tool: toolName} = props
  const toolNameRef = useRef(toolName)
  const [error, setError] = useState(null)
  const [errorDetailsOpen, setErrorDetailsOpen] = useState(__DEV__)
  const activeTool = tools.find(tool => tool.name === toolName)

  const handleShowDetails = useCallback(() => setErrorDetailsOpen(true), [])

  const handleRetry = useCallback(() => setError(null), [])

  // switched tool
  useEffect(() => {
    if (toolName !== toolNameRef.current) {
      setError(null)
      setErrorDetailsOpen(__DEV__)
      toolNameRef.current = toolName
    }
  }, [toolName])

  if (error) {
    return (
      <ErrorScreen
        activeTool={activeTool}
        error={error.error}
        info={error.info}
        onRetry={handleRetry}
        onShowDetails={handleShowDetails}
        showErrorDetails={errorDetailsOpen}
      />
    )
  }

  if (__DEV__ && !tools.length) {
    return (
      <div>
        No tools implement the part <code>part:@sanity/base/tool</code>
      </div>
    )
  }

  if (!activeTool) {
    return <div>Tool not found: {props.tool}</div>
  }

  if (DEBUG) {
    return null
  }

  const ActiveTool = activeTool.component

  return (
    <ErrorBoundary onCatch={setError}>
      <ActiveTool {...(props as any)} />
    </ErrorBoundary>
  )
}
