import {color} from '@sanity/color'
import {ErrorOutlineIcon, WarningOutlineIcon} from '@sanity/icons'
import {Box, Card, Flex, Text, Tooltip} from '@sanity/ui'
import React, {createElement} from 'react'
import {Validation} from './types'

export function FormFieldValidationStatus(props: {validation: Validation[]}) {
  const {validation} = props
  const errors = validation.filter((v) => v.type === 'error')
  const hasErrors = errors.length > 0
  const validationIcon = hasErrors ? ErrorOutlineIcon : WarningOutlineIcon
  const validationColor = hasErrors ? color.red[500].hex : color.yellow[500].hex

  return (
    <Tooltip
      content={
        <Box padding={1}>
          {validation.map((item, itemIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <Card key={itemIndex} padding={2} tone={item.type === 'error' ? 'critical' : 'caution'}>
              <Flex>
                <Box marginRight={3}>
                  <Text muted size={1}>
                    {item.type === 'error' ? <ErrorOutlineIcon /> : <WarningOutlineIcon />}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text muted size={1}>
                    {item.label}
                  </Text>
                </Box>
              </Flex>
            </Card>
          ))}
        </Box>
      }
      placement="right"
    >
      <Box>
        <Text muted size={1} weight="semibold" style={{color: validationColor}}>
          {createElement(validationIcon)}
        </Text>
      </Box>
    </Tooltip>
  )
}
