import {Card, studioTheme, ThemeProvider} from '@sanity/ui'
import React from 'react'

export function Studio({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={studioTheme}>
      <Card style={{height: '100%'}}>{children}</Card>
    </ThemeProvider>
  )
}
