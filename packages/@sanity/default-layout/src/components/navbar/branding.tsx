import {useProjectInfo} from '@sanity/base'
import BrandLogo from 'part:@sanity/base/brand-logo?'
import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoContainer = styled.div`
  padding-bottom: 1px;

  & > svg {
    display: block;
    fill: currentColor;
    height: 1em;
    width: auto;
  }
`

export function Branding() {
  const {displayName} = useProjectInfo()

  return (
    <Root>
      {BrandLogo && (
        <LogoContainer aria-label={displayName}>
          <BrandLogo />
        </LogoContainer>
      )}

      {!BrandLogo && <strong>{displayName || 'Sanity'}</strong>}
    </Root>
  )
}
