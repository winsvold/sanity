import {CardProvider, studioTheme, ThemeProvider} from '@sanity/ui'
import React, {useState} from 'react'
import {hot} from 'react-hot-loader/root'
import {App} from './app'
import {LocationProvider} from './lib/location'

function RootComponent() {
  const [themeMode] = useState<'light' | 'dark'>('light')

  return (
    <LocationProvider>
      <CardProvider scheme={themeMode}>
        <ThemeProvider theme={studioTheme}>
          <App />
        </ThemeProvider>
      </CardProvider>
    </LocationProvider>
  )
}

export const Root = hot(RootComponent)
