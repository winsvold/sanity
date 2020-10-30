import {Stack} from '@sanity/ui'
import {useRouterState} from 'part:@sanity/base/router'
import React from 'react'
import styled from 'styled-components'
import {Tool} from '../../lib/tool'
import {StateButton} from '../stateButton'

interface Props {
  activeToolName: string
  isVisible: boolean
  onSwitchTool: () => void
  tools: Tool[]
}

const Root = styled(Stack).attrs({forwardedAs: 'ol'})`
  margin: 0;
  padding: 0;
  list-style: none;

  & > li > a {
    display: block;
    width: 100%;
  }
`

export function ToolMenu(props: Props) {
  const {activeToolName, isVisible, onSwitchTool, tools} = props
  const routerState = useRouterState()

  return (
    <Root space={2}>
      {tools.map(tool => {
        const title = tool.title || tool.name || undefined

        return (
          <li key={tool.name}>
            <StateButton
              icon={tool.icon as any}
              justify="flex-start"
              key={tool.name}
              mode="bleed"
              onClick={onSwitchTool}
              selected={activeToolName === tool.name}
              state={{...routerState, tool: tool.name, [tool.name]: undefined}}
              text={title}
              tabIndex={isVisible ? 0 : -1}
            />
          </li>
        )
      })}
    </Root>
  )
}
