import React, {createElement, useEffect, useState} from 'react'
import {Subscription} from 'rxjs'
import * as sidecar from 'part:@sanity/default-layout/sidecar?'
import styled, {css} from 'styled-components'
import {Theme} from '@sanity/ui'
import {isSidecarOpenSetting} from '../controller'

const SIDECAR_ENABLED =
  sidecar?.SidecarLayout && sidecar?.isSidecarEnabled ? sidecar.isSidecarEnabled() : false

const Root = styled.div(({theme}: {theme: Theme}) => {
  const {media} = theme

  return css`
    @media (min-width: ${media[0]}px) {
      height: 100%;
      width: 420px;
    }
  `
})

export function Sidecar() {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    let sub: Subscription | null = null

    if (SIDECAR_ENABLED) {
      sub = isSidecarOpenSetting.listen().subscribe((val: boolean) => {
        setOpen(val !== false)
      })
    }

    return () => sub?.unsubscribe()
  }, [])

  if (!SIDECAR_ENABLED || !open) {
    return null
  }

  return <Root>{createElement(sidecar.SidecarLayout)}</Root>
}
