import React, {useCallback, useEffect, useState} from 'react'
import LoginWrapper from 'part:@sanity/base/login-wrapper?'
import {RouterProvider} from 'part:@sanity/base/router'
import AppLoadingScreen from 'part:@sanity/base/app-loading-screen'
import * as urlStateStore from './datastores/urlState'
import getOrderedTools from './util/getOrderedTools'
import rootRouter, {maybeRedirectToBase} from './router'
import DefaultLayout from './DefaultLayout'
import NotFound from './main/NotFound'

interface Intent {
  name: string
  params: {[key: string]: string}
}

interface State {
  intent: Intent | null
  urlState: Record<string, unknown>
  isNotFound: boolean
}

function DefaultLayoutRoot() {
  const tools = getOrderedTools()
  const [{intent, isNotFound, urlState}, setState] = useState<State>({
    intent: null,
    isNotFound: false,
    urlState: {}
  })

  const handleNavigate = useCallback(
    (newUrl: string, options: {replace: boolean}) => urlStateStore.navigate(newUrl, options),
    []
  )

  useEffect(() => {
    maybeRedirectToBase()

    const sub = urlStateStore.state.subscribe({
      next: event => {
        setState({
          urlState: event.state,
          isNotFound: event.isNotFound,
          intent: event.intent
        })
      }
    })

    return () => sub.unsubscribe()
  }, [])

  const content = isNotFound ? (
    <NotFound>
      {intent && (
        <div>
          <p>
            No tool can handle the intent: <strong>{intent.name}</strong> with parameters
          </p>
          <pre>{JSON.stringify(intent.params)}</pre>
        </div>
      )}
    </NotFound>
  ) : (
    <DefaultLayout tools={tools} />
  )

  const router = (
    <RouterProvider router={rootRouter} state={urlState} onNavigate={handleNavigate}>
      {content}
    </RouterProvider>
  )

  return LoginWrapper ? (
    <LoginWrapper LoadingScreen={<AppLoadingScreen text="Logging in" />}>{router}</LoginWrapper>
  ) : (
    router
  )
}

export default DefaultLayoutRoot
