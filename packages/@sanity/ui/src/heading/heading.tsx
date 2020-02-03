import React from 'react'
import styled, {css} from 'styled-components'

interface Props {
  as?: string
  children?: React.ReactNode
  size?: number
}

const Root = styled.h1`
  display: block;
  margin: 0;
  font: inherit;
  font-weight: 700;

  &:before {
    content: '';
    display: block;
    height: 0;
  }

  ${props => {
    const font = props.theme.heading[props.size] || {}

    return css`
      font-size: ${font.fontSize};
      line-height: ${font.lineHeight};
      letter-spacing: ${font.letterSpacing};
      transform: ${font.transform};

      &:before {
        margin-top: ${font.marginTop};
      }
    `
  }}
`

export function Heading(props: Props) {
  const as = props.as || 'h1'

  return (
    <Root as={as} size={props.size === undefined ? 4 : props.size}>
      {props.children}
    </Root>
  )
}
