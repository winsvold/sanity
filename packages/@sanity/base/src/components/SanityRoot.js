import {studioTheme} from '@sanity/ui'
import React from 'react'
import {ThemeProvider} from 'styled-components'
import config from 'config:sanity'
import RootComponent from 'part:@sanity/base/root'
import SnackbarProvider from 'part:@sanity/components/snackbar/provider'
import ErrorHandler from './ErrorHandler'
import VersionChecker from './VersionChecker'
import MissingProjectConfig from './MissingProjectConfig'
import styles from './styles/SanityRoot.css'
import DevServerStatus from './DevServerStatus'

function SanityRoot() {
  const {projectId, dataset} = config.api || {}

  if (!projectId || !dataset) {
    return <MissingProjectConfig />
  }

  return (
    <div className={styles.root}>
      <ThemeProvider theme={studioTheme}>
        <SnackbarProvider>
          <DevServerStatus />
          <ErrorHandler />
          <RootComponent />
          <VersionChecker />
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  )
}

export default SanityRoot
