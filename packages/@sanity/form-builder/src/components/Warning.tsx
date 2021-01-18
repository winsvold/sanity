import {ErrorOutlineIcon, WarningOutlineIcon} from '@sanity/icons'
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Details} from '../components/Details'

interface WarningProps {
  children?: React.ReactNode
  heading: React.ReactNode
  message: React.ReactNode
  tone?: 'caution' | 'critical'
}

export function Warning({heading, message, children, tone = 'caution'}: WarningProps) {
  return (
    <Card padding={2} radius={2} tone={tone}>
      <Flex padding={3}>
        <Box>
          <Text size={1}>
            {tone === 'caution' && <WarningOutlineIcon />}
            {tone === 'critical' && <ErrorOutlineIcon />}
          </Text>
        </Box>

        <Box flex={1} marginLeft={2}>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              {heading}
            </Text>

            <Details>{message}</Details>
          </Stack>
        </Box>
      </Flex>

      {children}
    </Card>
  )
}
