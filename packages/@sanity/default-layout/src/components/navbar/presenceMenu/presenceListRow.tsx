import {LinkIcon} from '@sanity/icons'
import {UserAvatar} from '@sanity/base/components'
import {GlobalPresence} from '@sanity/base/presence'
import {toString as pathToString} from '@sanity/util/paths'
import {orderBy} from 'lodash'
import {IntentLink} from 'part:@sanity/base/router'
import React from 'react'
import {Box, Flex, Text} from '@sanity/ui'
import styled from 'styled-components'

interface PresenceListRowProps {
  presence: GlobalPresence
  onClose: () => void
}

const RootLink = styled(IntentLink as any)`
  display: block;
  color: inherit;
  text-decoration: none;
  outline: none;

  @media (hover: hover) {
    &:hover {
      background: #06f;
      color: #fff;
    }
  }
`

export function PresenceListRow(props: PresenceListRowProps) {
  const {presence, onClose} = props
  const lastActiveLocation = orderBy(presence.locations || [], ['lastActiveAt'], ['desc']).find(
    location => location.documentId
  )
  const hasLink = Boolean(lastActiveLocation?.documentId)

  const item = (
    <Box paddingX={4} paddingY={2}>
      <Flex align="center">
        <UserAvatar user={presence.user} size={1} />

        <Box flex={1} paddingLeft={3}>
          <Text>{presence.user.displayName}</Text>
        </Box>

        {hasLink && (
          <Box paddingLeft={3}>
            <Text>
              <LinkIcon />
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  )

  if (!lastActiveLocation) {
    return item
  }

  return (
    <RootLink
      intent="edit"
      params={{
        id: lastActiveLocation.documentId,
        path: encodeURIComponent(pathToString(lastActiveLocation.path))
      }}
      onClick={onClose}
      title={presence?.user?.displayName && `Go to ${presence.user.displayName}`}
    >
      {item}
    </RootLink>
  )
}
