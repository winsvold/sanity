import {Button, ButtonProps, Tooltip} from '@sanity/ui'
import {StateLink, useRouterState} from 'part:@sanity/base/router'
import React, {forwardRef} from 'react'
import {Tool} from '../../types'

import styles from './ToolMenu.css'

interface Props {
  activeToolName: string
  direction: 'horizontal' | 'vertical'
  isVisible: boolean
  onSwitchTool: () => void
  tools: Tool[]
  showLabel?: boolean
  tone?: 'navbar'
}

const StateButton = forwardRef(
  (props: ButtonProps & {state: any} & React.HTMLProps<HTMLButtonElement>, ref) => {
    const {children, state, ...buttonProps} = props

    return (
      <Button {...buttonProps} {...({state} as any)} as={StateLink as any} ref={ref}>
        {children}
      </Button>
    )
  }
)

StateButton.displayName = 'StateButton'

const TOUCH_DEVICE = 'ontouchstart' in document.documentElement

export function ToolMenu(props: Props) {
  const {
    // activeToolName,
    direction,
    isVisible,
    onSwitchTool,
    tools,
    showLabel: showLabelProp
    // tone
  } = props
  const routerState = useRouterState()
  const isVertical = direction === 'horizontal'
  const showLabel = (TOUCH_DEVICE && !isVertical) || showLabelProp

  return (
    <ul className={styles.root} data-direction={direction} data-tone="navbar">
      {tools.map(tool => {
        const title = tool.title || tool.name || undefined
        const tooltipContent = <span className={styles.tooltipContent}>{title}</span>

        return (
          <li key={tool.name}>
            <Tooltip
              content={tooltipContent}
              disabled={showLabel}
              placement="bottom"
              title={showLabel ? '' : title}
              // tone={tone}
            >
              <div>
                <StateButton
                  icon={tool.icon as any}
                  key={tool.name}
                  mode="bleed"
                  onClick={onSwitchTool}
                  padding={direction === 'horizontal' ? 3 : 4}
                  // selected={activeToolName === tool.name}
                  state={{...routerState, tool: tool.name, [tool.name]: undefined}}
                  title={title}
                  tabIndex={isVisible ? 0 : -1}
                  // tone={tone}
                >
                  {tool.title}
                </StateButton>
              </div>
            </Tooltip>
          </li>
        )
      })}
    </ul>
  )
}
