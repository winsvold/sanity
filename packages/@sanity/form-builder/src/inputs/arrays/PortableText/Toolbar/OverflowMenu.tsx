import {EllipsisHorizontalIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Menu, MenuButton} from '@sanity/ui'
import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'

interface Action {
  firstInGroup?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface OverflowMenuProps {
  actionButtonComponent: React.ComponentType<{action: Action; disabled: boolean; visible: boolean}>
  actionMenuItemComponent: React.ComponentType<{
    action: Action
    disabled: boolean
  }>
  actions: Action[]
  disabled?: boolean
}

const preventDefault = (event: React.SyntheticEvent<HTMLElement>) => {
  event.preventDefault()
  event.stopPropagation()
}

const ActionButtonBox = styled.div`
  display: inline-flex;
  vertical-align: top;

  & + & {
    margin-left: var(--extra-small-padding);
  }

  &[data-visible='false'] {
    visibility: hidden;
  }
`

export function OverflowMenu(props: OverflowMenuProps) {
  const {
    actionButtonComponent: ActionButton,
    actionMenuItemComponent: ActionMenuItem,
    actions,
    disabled,
  } = props
  const actionBarRef = useRef<HTMLDivElement | null>(null)
  const [actionStates, setActionStates] = useState(
    actions.map((__, index) => ({index, visible: false}))
  )
  const actionStatesRef = useRef(actionStates)
  const showOverflowButton = actionStates.filter((a) => !a.visible).length > 0
  const hiddenActions = actionStates.filter((a) => !a.visible)
  const lastHidden = hiddenActions.length === 1
  const ioRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const actionBar = actionBarRef.current

    if (actionBar) {
      const actionContainerEls = Array.from(actionBar.childNodes) as HTMLDivElement[]

      const handleEntries: IntersectionObserverCallback = (entries) => {
        const newActionStates = actionStatesRef.current.slice(0)

        entries.forEach((entry) => {
          const element = entry.target as HTMLDivElement
          const actionIndex = Array.from(actionBar.childNodes).indexOf(element)
          const visible = entry.intersectionRatio === 1

          newActionStates[actionIndex] = {
            index: actionIndex,
            visible,
          }
        })

        setActionStates(() => newActionStates)

        actionStatesRef.current = newActionStates
      }

      // @todo: Improve this to show the last item if there's enough space
      const marginRight = 0

      const io = new window.IntersectionObserver(handleEntries, {
        root: actionBar,
        rootMargin: `0px ${marginRight}px 0px 0px`,
        threshold: [0, 0.1, 0.9, 1],
      })

      actionContainerEls.forEach((actionContainerEl) => io.observe(actionContainerEl))
      ioRef.current = io
    }

    return () => {
      if (ioRef.current) ioRef.current.disconnect()
    }
  }, [lastHidden])

  return (
    <Flex
      // Needed so the editor doesn't reset selection
      onMouseDown={preventDefault}
    >
      <Inline flex={1} ref={actionBarRef} space={1} style={{whiteSpace: 'nowrap'}}>
        {actions.map((action, actionIndex) => (
          <ActionButtonBox
            data-index={actionIndex}
            data-visible={actionStates[actionIndex].visible}
            key={String(actionIndex)}
          >
            <ActionButton
              action={action}
              disabled={disabled}
              visible={actionStates[actionIndex].visible}
            />
          </ActionButtonBox>
        ))}
      </Inline>

      <Box hidden={!showOverflowButton} paddingLeft={1}>
        <MenuButton
          button={
            <Button
              aria-label="Menu"
              icon={EllipsisHorizontalIcon}
              mode="bleed"
              padding={2}
              title="More actions"
            />
          }
          id="todo"
          menu={
            <Menu>
              {hiddenActions.map((hiddenAction, hiddenActionIndex) => {
                const action = actions[hiddenAction.index]
                return (
                  <ActionMenuItem
                    action={action}
                    disabled={disabled}
                    key={String(hiddenActionIndex)}
                  />
                )
              })}
            </Menu>
          }
          placement="bottom"
          portal
        />
      </Box>
    </Flex>
  )
}
