import {UserAvatar} from '@sanity/base/components'
import {useGlobalPresence} from '@sanity/base/hooks'
import {
  AvatarStack,
  Box,
  Button,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  Stack,
  Text
} from '@sanity/ui'
import client from 'part:@sanity/base/client'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {PresenceListRow} from './presenceListRow'

const Root = styled(Menu)`
  max-width: 280px;
`

const Header = styled(Box)``

const AvatarList = styled(Box)`
  max-height: calc(100vh - 130px);
  overflow: auto;
`

const NarrowButtonContent = styled(Box)`
  [data-eq-min~='1'] & {
    display: none;
  }
`

const WideButtonContent = styled(Box)`
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

  const menu = (
    <Root>
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

      <MenuDivider />

      <MenuItem
        as="a"
        href={`https://manage.sanity.io/projects/${projectId}/team`}
        iconRight="cog"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClose}
        text="Manage members"
      />
    </Root>
  )

  return (
    <MenuButton
      button={
        <Button mode="bleed" onClick={handleToggle} selected={open}>
          <>
            <NarrowButtonContent padding={3}>
              <Text>
                <Icon symbol="users" />
              </Text>
            </NarrowButtonContent>

            <WideButtonContent padding={3}>
              <AvatarStack maxLength={MAX_AVATARS_GLOBAL} style={{margin: -6}}>
                {presence.map(item => (
                  <UserAvatar key={item.user.id} user={item.user} />
                ))}
              </AvatarStack>
            </WideButtonContent>
          </>
        </Button>
      }
      id="presence-menu"
      menu={menu}
      popoverScheme="light"
    />
  )
}
