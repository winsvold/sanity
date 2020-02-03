import React from 'react'
import styled from 'styled-components'

export interface Props {
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  readOnly?: boolean
  value?: string
}

const Root = styled.input`
  -webkit-appearance: none;
  background: #fe0;
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em;
  line-height: 1;
  border: 1px solid #90f;
  border-radius: 0;
`

export function StringInput(props: Props) {
  return (
    <Root
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
      type="text"
      value={props.value}
    />
  )
}
