import {Avatar, AvatarStack, Box, Flex, Icon, Stack, Text} from '@sanity/ui'
import React from 'react'

export function FormField({
  children,
  description,
  inputId,
  title,
}: {
  children: React.ReactNode
  description?: React.ReactNode
  inputId?: string
  title: React.ReactNode
}) {
  return (
    <Stack space={3}>
      <Flex align="flex-end">
        <Box
          flex={1}
          // style={{outline: '1px solid red'}}
        >
          <Stack space={2}>
            <Flex>
              <Text size={1} weight="semibold">
                {inputId && <label htmlFor={inputId}>{title}</label>}
                {!inputId && title}
              </Text>

              <Box marginLeft={2}>
                <Text muted size={1}>
                  <Icon symbol="warning-outline" />
                </Text>
              </Box>
            </Flex>

            {description && (
              <Text muted size={1}>
                {description}
              </Text>
            )}
          </Stack>
        </Box>

        <Box marginLeft={3}>
          <AvatarStack style={{margin: '-6px 0'}}>
            <Avatar />
            <Avatar />
            <Avatar />
          </AvatarStack>
        </Box>
      </Flex>

      <Stack>{children}</Stack>
    </Stack>
  )
}
