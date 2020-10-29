import {Box, ResizeObserver, Text, Tooltip} from '@sanity/ui'
import {useRouterState} from 'part:@sanity/base/router'
import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {StateButton} from '../components'
import {Tool} from '../types'

const Root = styled.div`
  /* outline: 1px solid red; */
`

const ButtonContainer = styled.ol`
  /* background: #fe0; */
  list-style: none;
  margin: 0;
  padding: 0;
  display: inline-flex;
  vertical-align: top;

  & > li {
    flex-shrink: min-content;
  }

  & > li + li {
    margin-left: 0.5em;
  }
`

interface ToolMenuProps {
  activeToolName: string
  // isVisible: boolean
  onSwitchTool: () => void
  tools: Tool[]
  onHide: () => void
  onShow: () => void
}

export function ToolMenu(props: ToolMenuProps) {
  const {activeToolName, onHide, onSwitchTool, onShow, tools} = props
  const [collapsed, setCollapsed] = useState(false)
  const [hidden, setHidden] = useState(false)
  const expandedWidthRef = useRef<number>(-1)
  const collapsedWidthRef = useRef<number>(-1)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [widths, setWidths] = useState({current: -1, wrapper: -1})
  const widthsRef = useRef(widths)

  useEffect(() => {
    if (widths.current < 0) return
    if (widths.wrapper < 0) return

    if (!collapsed) {
      if (expandedWidthRef.current === -1) {
        expandedWidthRef.current = widths.wrapper
      }

      if (widths.current < widths.wrapper) {
        setCollapsed(true)
        return
      }

      return
    }

    if (!hidden) {
      if (widths.wrapper === expandedWidthRef.current) {
        return
      }

      if (collapsedWidthRef.current === -1) {
        collapsedWidthRef.current = widths.wrapper
      }

      if (expandedWidthRef.current < widths.current) {
        setCollapsed(false)
        return
      }

      if (widths.current < widths.wrapper) {
        onHide()
        setHidden(true)
        return
      }

      return
    }

    if (widths.wrapper !== 0) {
      return
    }

    if (collapsedWidthRef.current < widths.current) {
      onShow()
      setHidden(false)

      if (expandedWidthRef.current < widths.current) {
        setCollapsed(false)
      }
    }
  }, [collapsed, hidden, onHide, onShow, widths])

  useEffect(() => {
    const rootElement = rootRef.current
    const wrapperElement = wrapperRef.current

    if (!rootElement || !wrapperElement) return undefined

    const ro = new ResizeObserver(entries => {
      const nextWidths = {...widthsRef.current}

      for (const entry of entries) {
        const entryWidth = entry.contentRect.width

        if (entry.target === rootElement) {
          nextWidths.current = entryWidth
        }

        if (entry.target === wrapperElement) {
          nextWidths.wrapper = entryWidth
        }
      }

      setWidths(nextWidths)
      widthsRef.current = nextWidths
    })

    ro.observe(rootElement)
    ro.observe(wrapperElement)

    return () => ro.disconnect()
  }, [])

  return (
    <Root data-ui="ToolMenu" ref={rootRef}>
      <ButtonContainer ref={wrapperRef as any}>
        {!hidden &&
          tools.map(tool => {
            return (
              <ToolMenuItem
                collapsed={collapsed}
                key={tool.name}
                onSwitchTool={onSwitchTool}
                selected={activeToolName === tool.name}
                tool={tool}
              />
            )
          })}
      </ButtonContainer>
    </Root>
  )
}

function ToolMenuItem({
  collapsed,
  onSwitchTool,
  selected,
  tool
}: {
  collapsed: boolean
  onSwitchTool: () => void
  selected: boolean
  tool: Tool
}) {
  const routerState = useRouterState()
  const title = tool.title || tool.name

  return (
    <li>
      <Tooltip
        content={
          <Box padding={2}>
            <Text size={1}>{title}</Text>
          </Box>
        }
        disabled={!collapsed}
        placement="bottom"
      >
        <div>
          <StateButton
            icon={(tool.icon as any) || 'plug'}
            key={tool.name}
            mode="bleed"
            onClick={onSwitchTool}
            padding={3}
            selected={selected}
            state={{...routerState, tool: tool.name, [tool.name]: undefined}}
            text={collapsed ? undefined : tool.title}
          />
        </div>
      </Tooltip>
    </li>
  )
}
