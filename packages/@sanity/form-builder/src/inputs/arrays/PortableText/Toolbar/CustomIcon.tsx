import React from 'react'
import styled from 'styled-components'

interface CustomIconProps {
  icon: string
  active: boolean
}

const Root = styled.div`
  width: 1em;
  height: 1em;
  border-radius: inherit;
  background-origin: content-box;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transform: scale(0.7);
`

export default function CustomIcon(props: CustomIconProps) {
  const {icon, active} = props

  const inlineStyle = {
    backgroundImage: `url(${icon})`,
    filter: active ? 'invert(100%)' : 'invert(0%)',
  }

  return <Root style={inlineStyle} />
}
