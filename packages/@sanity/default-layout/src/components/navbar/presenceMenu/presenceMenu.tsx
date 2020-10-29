import {UserAvatar} from '@sanity/base/components'
import {useGlobalPresence} from '@sanity/base/hooks'
import {CogIcon} from '@sanity/icons'
import {
  AvatarStack,
  Box,
  Button,
  Flex,
  Heading,
  Popover,
  Stack,
  Text,
  useClickOutside,
  useGlobalKeyDown
} from '@sanity/ui'
import client from 'part:@sanity/base/client'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {PresenceListRow} from './presenceListRow'

const Root = styled.div`
  display: flex;
  align-items: center;
`

const PopoverContent = styled.div`
  max-width: 280px;
`

const Header = styled(Box)``

const AvatarList = styled(Box)`
  max-height: calc(100vh - 130px);
  overflow: auto;
`

const ManageMembers = styled(Box)`
  border-top: 1px solid var(--card-hairline-soft-color);
  position: sticky;
  bottom: 0;
`

const ManageLink = styled.a`
  display: block;
  color: inherit;
  text-decoration: none;
  outline: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--card-focus-bg-color);
      color: var(--card-focus-fg-color);
    }
  }
`

const NarrowButton = styled(Button)`
  [data-eq-min~='1'] & {
    display: none;
  }
`

const WideButton = styled(Button)`
  [data-eq-max~='1'] & {
    display: none;
  }
`

const MAX_AVATARS_GLOBAL = 4

export function PresenceMenu() {
  const {projectId} = client.config()
  const presence = useGlobalPresence()
  const [open, setOpen] = useState(false)

  const handleToggle = useCallback(() => setOpen(!open), [open])
  const handleClose = useCallback(() => setOpen(false), [])

  const popoverContent = (
    <PopoverContent>
      {presence.length === 0 && (
        <Header padding={4}>
          <Stack space={3}>
            <Heading as="p" size={1}>
              <strong>No one else is here</strong>
            </Heading>
            <Text size={1}>Invite people to the project to see their online status.</Text>
          </Stack>
        </Header>
      )}

      {presence.length > 0 && (
        <AvatarList paddingY={3}>
          {presence.map(item => (
            <PresenceListRow key={item.user.id} presence={item} onClose={handleClose} />
          ))}
        </AvatarList>
      )}

      <ManageMembers paddingY={2}>
        <ManageLink
          href={`https://manage.sanity.io/projects/${projectId}/team`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
        >
          <Box paddingX={4} paddingY={3}>
            <Flex align="center">
              <Box flex={1} paddingRight={3}>
                <Text>Manage members</Text>
              </Box>
              <Text>
                <CogIcon />
              </Text>
            </Flex>
          </Box>
        </ManageLink>
      </ManageMembers>
    </PopoverContent>
  )

  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null)

  useClickOutside(
    useCallback(() => {
      setOpen(false)
    }, []),
    [rootElement]
  )

  useGlobalKeyDown(
    useCallback(
      (event: KeyboardEvent) => {
        if (!open) return
        if (event.key === 'Escape') {
          event.stopPropagation()
          setOpen(false)
        }
      },
      [open]
    )
  )

  return (
    <Root ref={setRootElement}>
      <Popover content={popoverContent} open={open}>
        <div>
          <NarrowButton
            icon="users"
            // iconStatus={presence.length > 0 ? 'success' : undefined}
            mode="bleed"
            onClick={handleToggle}
            padding={3}
            selected={open}
          />

          <WideButton mode="bleed" onClick={handleToggle} padding={3} selected={open}>
            <AvatarStack maxLength={MAX_AVATARS_GLOBAL}>
              {presence.map(item => (
                <UserAvatar key={item.user.id} user={item.user} />
              ))}
            </AvatarStack>
          </WideButton>
        </div>
      </Popover>
    </Root>
  )
}
