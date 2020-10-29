import React from 'react'
import BrandLogo from 'part:@sanity/base/brand-logo?'
import styled from 'styled-components'

interface BrandingProps {
  projectName: string
}

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

export function Branding(props: BrandingProps) {
  const {projectName} = props

  return (
    <Root>
      {BrandLogo && (
        <LogoContainer aria-label={projectName}>
          <BrandLogo />
        </LogoContainer>
      )}

      {!BrandLogo && <strong>{projectName || 'Sanity'}</strong>}
    </Root>
  )
}
