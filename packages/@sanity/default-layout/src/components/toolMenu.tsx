import {Box, Text, Tooltip} from '@sanity/ui'
import {useRouterState} from 'part:@sanity/base/router'
import React from 'react'
import styled from 'styled-components'
import {Tool} from '../types'
import {StateButton} from '.'

interface Props {
  activeToolName: string
  direction: 'horizontal' | 'vertical'
  // isVisible: boolean
  onSwitchTool: () => void
  tools: Tool[]
  // showLabel?: boolean
  tone?: 'navbar'
}

const TOUCH_DEVICE = 'ontouchstart' in document.documentElement

const Root = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  &[data-direction='horizontal'] {
    white-space: nowrap;

    & > li {
      display: inline-block;
      vertical-align: top;
    }

    & > li + li {
      margin-left: 0.5em;
    }
  }

  &[data-direction='vertical'] {
    & > li > div > a {
      width: 100%;

      & > span > span {
        justify-content: flex-start;
      }
    }

    & > li + li {
      margin-top: 0.25em;
    }
  }
`

export function ToolMenu(props: Props) {
  const {
    // activeToolName,
    direction,
    // isVisible,
    onSwitchTool,
    tools
    // showLabel: showLabelProp
    // tone
  } = props
  const routerState = useRouterState()
  const isVertical = direction === 'horizontal'
  const showLabel = TOUCH_DEVICE && !isVertical // || showLabelProp

  return (
    <Root data-direction={direction} data-tone="navbar">
      {tools.map(tool => {
        const title = tool.title || tool.name || undefined

        return (
          <li key={tool.name}>
            <Tooltip
              content={
                <Box padding={2}>
                  <Text size={1}>{title}</Text>
                </Box>
              }
              disabled={showLabel}
              placement="bottom"
              title={showLabel ? '' : title}
              // tone={tone}
            >
              <StateButton
                icon={tool.icon as any}
                key={tool.name}
                mode="bleed"
                onClick={onSwitchTool}
                padding={direction === 'horizontal' ? 3 : 4}
                // selected={activeToolName === tool.name}
                state={{...routerState, tool: tool.name, [tool.name]: undefined}}
                title={showLabel ? undefined : title}
                // tabIndex={isVisible ? 0 : -1}
                // tone={tone}
              >
                {showLabel && tool.title}
              </StateButton>
            </Tooltip>
          </li>
        )
      })}
    </Root>
  )
}
