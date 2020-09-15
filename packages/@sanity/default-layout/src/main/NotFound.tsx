import React from 'react'
import {StateLink, useRouterState} from 'part:@sanity/base/router'
import {HAS_SPACES} from '../util/spaces'

import styles from './NotFound.css'

interface NotFoundProps {
  children: React.ReactNode
}

export default function NotFound({children}: NotFoundProps) {
  const routerState = useRouterState()
  const rootState = HAS_SPACES && routerState && routerState.space ? {space: routerState.space} : {}

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Page not found</h2>
      </header>

      <div className={styles.content}>{children}</div>

      <div className={styles.footer}>
        <StateLink state={rootState}>Go to index</StateLink>
      </div>
    </div>
  )
}
