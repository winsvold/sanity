import React from 'react'
import {ThemeProvider as StyledThemeProvider} from 'styled-components'
import defaultTheme from './default'
import {Theme} from './types'

interface Props {
  children: React.ReactNode
  theme?: Theme
}

export function ThemeProvider(props: Props) {
  return (
    <StyledThemeProvider theme={props.theme || defaultTheme}>{props.children}</StyledThemeProvider>
  )
}
