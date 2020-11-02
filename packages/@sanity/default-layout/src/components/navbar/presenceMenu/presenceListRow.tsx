import {UserAvatar} from '@sanity/base/components'
import {GlobalPresence} from '@sanity/base/presence'
import {Box, Flex, Icon, MenuItem, Text} from '@sanity/ui'
import {toString as pathToString} from '@sanity/util/paths'
import {orderBy} from 'lodash'
import {IntentLink} from 'part:@sanity/base/router'
import React from 'react'
import styled from 'styled-components'

const DisplayNameText = styled(Text)`
  & > span {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

interface PresenceListRowProps {
  presence: GlobalPresence
  onClose: () => void
}

export function PresenceListRow(props: PresenceListRowProps) {
  const {presence, onClose} = props
  const lastActiveLocation = orderBy(presence.locations || [], ['lastActiveAt'], ['desc']).find(
    location => location.documentId
  )

  const item = (
    <Box paddingX={4} paddingY={2}>
      <Flex align="center">
        <UserAvatar user={presence.user} size={1} />

        <Box flex={1} paddingLeft={3}>
          <DisplayNameText>
            <span>{presence.user.displayName}</span>
          </DisplayNameText>
        </Box>

        {lastActiveLocation && (
          <Box paddingLeft={4}>
            <Text>
              <Icon symbol="link" />
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  )

  if (!lastActiveLocation) {
    return item
  }

  const intentLinkProps: any = {
    as: IntentLink,
    intent: 'edit',
    params: {
      id: lastActiveLocation.documentId,
      path: encodeURIComponent(pathToString(lastActiveLocation.path))
    }
  }

  return (
    <MenuItem iconRight="link" onClick={onClose} {...intentLinkProps}>
      {item}
    </MenuItem>
  )
}
