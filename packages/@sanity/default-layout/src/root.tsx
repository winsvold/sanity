import {Card, Code, Label, Stack, Text} from '@sanity/ui'
import LoginWrapper from 'part:@sanity/base/login-wrapper?'
import {RouterProvider} from 'part:@sanity/base/router'
import AppLoadingScreen from 'part:@sanity/base/app-loading-screen'
import React from 'react'
import {Layout} from './components/layout'
import {NotFound} from './components/notFound'
import {getOrderedTools} from './lib/tool'
import {navigate, rootRouter, useUrlState} from './lib/url'

export default function DefaultLayoutRoot() {
  const tools = getOrderedTools()
  const {intent, state, isNotFound} = useUrlState()

  // URL state is not loaded yet
  if (!state) return null

  const content = (
    <RouterProvider router={rootRouter} state={state} onNavigate={navigate}>
      {isNotFound && (
        <NotFound>
          {intent && (
            <Stack space={5}>
              <Text>
                No tool can handle the intent: <strong>{intent.name}</strong>
              </Text>

              <Stack space={3}>
                <Label as="h2">Parameters</Label>

                <Card padding={3} radius={2} tone="transparent">
                  <Code language="json">{JSON.stringify(intent.params, null, 2)}</Code>
                </Card>
              </Stack>
            </Stack>
          )}
        </NotFound>
      )}

      {!isNotFound && <Layout tools={tools} />}
    </RouterProvider>
  )

  if (!LoginWrapper) {
    return content
  }

  return (
    <LoginWrapper LoadingScreen={<AppLoadingScreen text="Logging in" />}>{content}</LoginWrapper>
  )
}
