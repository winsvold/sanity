import {SpinnerIcon} from '@sanity/icons'
import {Inline, Layer, Stack, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'

interface SpinnerProps {
  center?: boolean
  delay?: number // delay in ms
  fullscreen?: boolean
  inline?: boolean
  message?: string
}

const StyledSpinnerIcon = styled(SpinnerIcon)``

export function Spinner(props: SpinnerProps) {
  const {fullscreen, inline, message} = props

  const spinner = inline ? (
    <Inline>
      <StyledSpinnerIcon />
      <Text>{message}</Text>
    </Inline>
  ) : (
    <Stack>
      <StyledSpinnerIcon />
      <Text>{message}</Text>
    </Stack>
  )

  if (fullscreen) {
    return <Layer>{spinner}</Layer>
  }

  return spinner
}
