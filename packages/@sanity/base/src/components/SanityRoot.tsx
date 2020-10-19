import {Card, CardProvider, ThemeProvider} from '@sanity/ui'
import config from 'config:sanity'
import RootComponent from 'part:@sanity/base/root'
import {LayerProvider} from 'part:@sanity/components/layer'
import {PortalProvider} from 'part:@sanity/components/portal'
import SnackbarProvider from 'part:@sanity/components/snackbar/provider'
import React, {useState} from 'react'
import Refractor from 'react-refractor'
import json from 'refractor/lang/json'
import bash from 'refractor/lang/bash'
import styled from 'styled-components'
import studioTheme from '../theme'
import {SanityProvider} from '../providers/SanityProvider'
import {userColorManager, UserColorManagerProvider} from '../user-color'
import ErrorHandler from './ErrorHandler'
import DevServerStatus from './DevServerStatus'
import {GlobalStyle} from './GlobalStyle'
import MissingProjectConfig from './MissingProjectConfig'
import VersionChecker from './VersionChecker'

Refractor.registerLanguage(json)
Refractor.registerLanguage(bash)

const Root = styled(Card)`
  height: 100%;
`

function SanityRoot() {
  const {projectId, dataset, apiHost} = config.api || {}
  const {name: displayName} = config.project
  const [portalElement, setPortalElement] = useState(() => document.createElement('div'))
  const themeMode = 'light'

  if (!projectId || !dataset) {
    return <MissingProjectConfig />
  }

  return (
    <SanityProvider
      projectId={projectId}
      dataset={dataset}
      apiHost={apiHost}
      displayName={displayName}
    >
      <ThemeProvider theme={studioTheme}>
        <CardProvider scheme={themeMode}>
          <UserColorManagerProvider manager={userColorManager}>
            <PortalProvider element={portalElement}>
              <LayerProvider>
                <SnackbarProvider>
                  <GlobalStyle scheme={themeMode} />
                  <Root tone="transparent">
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
    </SanityProvider>
  )
}

export default SanityRoot
