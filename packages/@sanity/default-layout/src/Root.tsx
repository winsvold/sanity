import LoginWrapper from 'part:@sanity/base/login-wrapper?'
import {RouterProvider} from 'part:@sanity/base/router'
import AppLoadingScreen from 'part:@sanity/base/app-loading-screen'
import React, {useEffect, useState} from 'react'
import * as urlStateStore from './datastores/urlState'
import DefaultLayout from './DefaultLayout'
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

    const sub = urlStateStore.state.subscribe({
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
    <RouterProvider
      router={rootRouter}
      state={urlState}
      // eslint-disable-next-line react/jsx-handler-names
      onNavigate={urlStateStore.navigate}
    >
      {isNotFound && (
        <NotFound>
          {intent && (
            <div>
              No tool can handle the intent: <strong>{intent.name}</strong> with parameters{' '}
              <pre>{JSON.stringify(intent.params)}</pre>
            </div>
          )}
        </NotFound>
      )}

      {!isNotFound && <DefaultLayout tools={tools} />}
    </RouterProvider>
  )

  return LoginWrapper ? (
    <LoginWrapper LoadingScreen={<AppLoadingScreen text="Logging in" />}>{content}</LoginWrapper>
  ) : (
    content
  )
}

export default DefaultLayoutRoot
