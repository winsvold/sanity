import {BoundaryElementProvider, Box, Card, CardTone, Flex, Layer, Text} from '@sanity/ui'
import React, {useState} from 'react'
import styled, {css} from 'styled-components'

interface PaneProps {
  actions?: React.ReactNode
  children?: React.ReactNode
  // index: number
  isCollapsed?: boolean
  isLoading?: boolean
  isSelected?: boolean
  isScrollable?: boolean
  onCollapse?: () => void
  onExpand?: () => void
  tone?: CardTone
  title?: React.ReactNode
  // title="Unknown pane type"
  // index={this.props.index}
  // isSelected={isSelected}
  // isCollapsed={isCollapsed}
  // onCollapse={onCollapse}
  // onExpand={onExpand}
}

const Root = styled(Flex).attrs({direction: 'column'})`
  height: 100%;
  border: 10px solid red;
  box-sizing: border-box;
`

const Header = styled(Layer)`
  position: relative;

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    border-bottom: 1px solid var(--card-hairline-soft-color);
  }
`

const Content = styled(Card)<{isCollapsed?: boolean; isScrollable?: boolean}>(
  ({isCollapsed, isScrollable}) => {
    return css`
      position: relative;
      opacity: ${isCollapsed ? 0 : 1};

      ${isScrollable &&
        css`
          overflow: auto;
        `}
    `
  }
)

export function Pane({actions, children, isCollapsed, isScrollable, title}: PaneProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  return (
    <BoundaryElementProvider element={element}>
      <Root ref={setElement}>
        <Header>
          <Card>
            <Flex align="center">
              <Box flex={1} padding={4}>
                <Text weight="semibold">
                  <span>{title}</span>
                </Text>
              </Box>
              {actions && <Box padding={2}>{actions}</Box>}
            </Flex>
          </Card>
        </Header>
        <Content flex={1} isCollapsed={isCollapsed} isScrollable={isScrollable}>
          {children}
        </Content>
      </Root>
    </BoundaryElementProvider>
  )
}
