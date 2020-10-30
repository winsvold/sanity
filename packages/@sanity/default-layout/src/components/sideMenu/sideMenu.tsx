import {UserAvatar} from '@sanity/base/components'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import config from 'config:sanity'
import React from 'react'
import styled, {css} from 'styled-components'
import {useCurrentUser} from '../../lib/user/hooks'
import {DatasetSelect} from '../../lib/__experimental_spaces/components'
import {HAS_SPACES} from '../../lib/__experimental_spaces/constants'
import {Tool} from '../../lib/tool'
import {ToolMenu} from './toolMenu'

interface Props {
  activeToolName: string | null
  open: boolean
  onClose: () => void
  onSwitchTool: () => void
  tools: Tool[]
}

const Root = styled.div<{open: boolean}>`
  /* z-index: var(--zindex-drawer); */
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${({open}) => (open ? 'all' : 'none')};
`

const Overlay = styled.div<{open: boolean}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--card-shadow-outline-color);
  opacity: ${({open}) => (open ? 1 : 0)};
`

const SidemenuCard = styled(Card)<{open: boolean}>(({open}: {open: boolean}) => {
  return css`
    position: relative;
    min-width: 200px;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: 200ms transform ease-in-out;
    transform: translate3d(calc(-100% - 1px), 0, 0);
    padding-left: env(safe-area-inset-left);

    ${open &&
      css`
        transform: translate(0);
      `}

    & > div {
      height: 100%;
    }
  `
})

const HeaderBox = styled(Box)`
  border-bottom: 1px solid var(--card-hairline-soft-color);
`

const DatasetBox = styled(Box)`
  border-top: 1px solid var(--card-hairline-soft-color);
`

const ContentBox = styled(Box)`
  overflow: auto;
`

const FooterBox = styled(Box)`
  border-top: 1px solid var(--card-hairline-soft-color);
`

export function SideMenu(props: Props) {
  const projectName = config && config.project.name
  const {activeToolName, onClose, onSwitchTool, open, tools} = props
  const tabIndex = open ? 0 : -1
  const currentUser = useCurrentUser()

  return (
    <Root open={open}>
      <Overlay open={open} />
      <SidemenuCard marginRight={5} open={open} shadow={1}>
        <Flex direction="column">
          <HeaderBox>
            <Flex>
              <Box flex={1} padding={4}>
                <Text weight="bold">{projectName}</Text>
              </Box>

              <Box padding={2}>
                <Button
                  icon="close"
                  mode="bleed"
                  onClick={onClose}
                  tabIndex={tabIndex}
                  title="Close menu"
                />
              </Box>
            </Flex>

            {HAS_SPACES && (
              <DatasetBox padding={2}>
                <Stack>
                  <DatasetSelect />
                </Stack>
              </DatasetBox>
            )}
          </HeaderBox>

          <ContentBox flex={1} padding={2}>
            <ToolMenu
              activeToolName={activeToolName}
              isVisible={open}
              onSwitchTool={onSwitchTool}
              tools={tools}
            />
          </ContentBox>

          <FooterBox>
            <Flex align="center">
              <Box flex={1}>
                {currentUser.isLoading && <Text>Loading user…</Text>}

                {currentUser.value && (
                  <Flex align="center">
                    <Box padding={3}>
                      <UserAvatar size={1} user={currentUser.value} />
                    </Box>
                    <Box flex={1}>
                      <Text weight="semibold">{currentUser.value.displayName}</Text>
                    </Box>
                  </Flex>
                )}
              </Box>

              <Box padding={2}>
                <Button
                  iconRight="leave"
                  mode="bleed"
                  onClick={currentUser.logout}
                  tabIndex={tabIndex}
                />
              </Box>
            </Flex>
          </FooterBox>
        </Flex>
      </SidemenuCard>
    </Root>
  )
}
