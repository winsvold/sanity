import React from 'react'
import styled, {css} from 'styled-components'

interface Props {
  as?: string
  children?: React.ReactNode
  size?: number
}

const Root = styled.div<{size: number}>`
  display: block;
  margin: 0;

  &:before {
    content: '';
    display: block;
    height: 0;
  }

  ${props => {
    const font = props.theme.text[props.size] || {}

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

export function Text(props: Props) {
  return (
    <Root as={props.as} size={props.size === undefined ? 2 : props.size}>
      {props.children}
    </Root>
  )
}
