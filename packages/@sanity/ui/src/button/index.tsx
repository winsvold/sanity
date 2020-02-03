import React from 'react'
import styled from 'styled-components'

const RootButton = styled.div`
  background: ${props => props.theme.bg1};
`

export function Button() {
  return (
    <RootButton>
      <span>Button</span>
    </RootButton>
  )
}
