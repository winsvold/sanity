import {Card, Code, Label, Stack, Text} from '@sanity/ui'
import LoginWrapper from 'part:@sanity/base/login-wrapper?'
import {RouterProvider} from 'part:@sanity/base/router'
import AppLoadingScreen from 'part:@sanity/base/app-loading-screen'
import React, {useEffect, useState} from 'react'
import {navigate, urlState$} from './datastores/urlState'
import DefaultLayout from './defaultLayout'
import {NotFound} from './notFound'
import rootRouter, {maybeRedirectToBase} from './router'
import getOrderedTools from './util/getOrderedTools'

interface State {
  intent?: {
    name: string
    params: {[key: string]: string}
  }
  urlState?: Record<string, any>
  isNotFound?: boolean
}

function DefaultLayoutRoot() {
  const tools = getOrderedTools()
  const [state, setState] = useState<State>({urlState: {}})
  const {intent, urlState, isNotFound} = state

  useEffect(() => {
    maybeRedirectToBase()

    const sub = urlState$.subscribe({
      next: event =>
        setState({
          urlState: event.state,
          isNotFound: event.isNotFound,
          intent: event.intent
        })
    })

    return () => sub.unsubscribe()
  }, [])

  const content = (
    <RouterProvider router={rootRouter} state={urlState || {}} onNavigate={navigate}>
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

      {!isNotFound && <DefaultLayout tools={tools} />}
    </RouterProvider>
  )

  if (!LoginWrapper) {
    return content
  }

  return (
    <LoginWrapper LoadingScreen={<AppLoadingScreen text="Logging in" />}>{content}</LoginWrapper>
  )
}

export default DefaultLayoutRoot
