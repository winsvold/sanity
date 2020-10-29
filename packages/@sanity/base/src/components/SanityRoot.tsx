import {Card, CardProvider, ThemeProvider} from '@sanity/ui'
import React, {useRef, useState} from 'react'
import config from 'config:sanity'
import RootComponent from 'part:@sanity/base/root'
import {LayerProvider} from 'part:@sanity/components/layer'
import {PortalProvider} from 'part:@sanity/components/portal'
import SnackbarProvider from 'part:@sanity/components/snackbar/provider'
import Refractor from 'react-refractor'
import json from 'refractor/lang/json'
import bash from 'refractor/lang/bash'
import styled, {createGlobalStyle} from 'styled-components'
import theme from '../theme'
import {userColorManager, UserColorManagerProvider} from '../user-color'
import ErrorHandler from './ErrorHandler'
import VersionChecker from './VersionChecker'
import MissingProjectConfig from './MissingProjectConfig'
import DevServerStatus from './DevServerStatus'

Refractor.registerLanguage(json)
Refractor.registerLanguage(bash)

const GlobalStyle = createGlobalStyle`
  html, #sanityBody, #sanity {
    height: 100%;
  }

  a {
    color: ${theme.color.light.card.tones.transparent.enabled.link};
  }

  /* ::selection {
    background: var(--text-selection-color);
  } */

  /* :focus {
    outline-color: var(--focus-color);
  } */

  #sanityBody {
    background-color: ${theme.color.light.card.tones.transparent.enabled.bg};
    color: ${theme.color.light.card.tones.transparent.enabled.fg};
    font-family: ${theme.fonts.text.family};
    font-size: 100%;
    line-height: ${theme.fonts.text.sizes[2].lineHeight / theme.fonts.text.sizes[2].fontSize};
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    margin: 0;
  }
`

const Root = styled(Card)`
  height: 100%;
`

function SanityRoot() {
  const {projectId, dataset} = config.api || {}
  const rootRef = useRef(null)
  const [portalElement, setPortalElement] = useState(() => document.createElement('div'))
  const themeMode = 'light'

  if (!projectId || !dataset) {
    return <MissingProjectConfig />
  }

  return (
    <ThemeProvider theme={theme}>
      <CardProvider scheme={themeMode}>
        <UserColorManagerProvider manager={userColorManager}>
          <PortalProvider element={portalElement}>
            <LayerProvider>
              <SnackbarProvider>
                <GlobalStyle />
                <Root ref={rootRef} tone="transparent">
                  <DevServerStatus />
                  <ErrorHandler />
                  <RootComponent />
                  <VersionChecker />
                </Root>
                <div data-portal="" ref={setPortalElement} />
              </SnackbarProvider>
            </LayerProvider>
          </PortalProvider>
        </UserColorManagerProvider>
      </CardProvider>
    </ThemeProvider>
  )
}

export default SanityRoot
