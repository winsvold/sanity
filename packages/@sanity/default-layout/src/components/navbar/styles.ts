import {Box, Card} from '@sanity/ui'
import styled, {css} from 'styled-components'

export const Root = styled(Card)`
  position: relative;
  white-space: nowrap;
  line-height: 0;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid var(--card-hairline-soft-color);
  }
`

function hamburgerContainerStyles(props: {showToolMenu: boolean}) {
  const {showToolMenu} = props

  return css`
    ${showToolMenu &&
      css`
        [data-eq-min~='0'] & {
          display: none;
        }
      `}
  `
}

export const HamburgerContainer = styled.div<{showToolMenu: boolean}>(hamburgerContainerStyles)

export const BrandingContainer = styled.div`
  [data-eq-max~='0'] & {
    flex: 1;
    min-width: 0;
    text-align: center;
  }
`

export const DatasetSelectContainer = styled.div<{showToolMenu: boolean}>(
  (props: {showToolMenu: boolean}) => {
    const {showToolMenu} = props

    return css`
      display: none;
      box-sizing: border-box;

      ${showToolMenu &&
        css`
          [data-eq-min~='0'] & {
            display: block;
          }
        `}
    `
  }
)

export const NarrowCreateButtonContainer = styled.div`
  [data-eq-min~='0'] & {
    display: none;
  }
`

export const WideCreateButtonContainer = styled.div`
  [data-eq-max~='0'] & {
    display: none;
  }
`

export const SearchContainer = styled.div((props: {open: boolean}) => {
  const {open} = props

  return css`
    [data-eq-max~='0'] & {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      /* hide on mobile */
      ${!open &&
        css`
          & > div {
            display: none !important;
          }
        `}
    }

    [data-eq-min~='0'] & {
      width: 25%;
      min-width: 200px;
      max-width: 400px;
    }
  `
})

export const PackageStatusContainer = styled.div`
  [data-eq-max~='0'] & {
    display: none;
  }
`

export const HelpButtonContainer = styled.div`
  [data-eq-max~='0'] & {
    display: none;
  }
`

export const SearchButtonContainer = styled.div((props: {open: boolean}) => {
  const {open} = props

  return css`
    [data-eq-max~='0'] & {
      display: ${open ? 'none' : 'block'};
    }

    [data-eq-min~='0'] & {
      display: none;
    }
  `
})

export const ToolMenuContainer = styled(Box)`
  min-width: 0;

  [data-eq-max~='0'] & {
    display: none;
  }
`

export const LoginStatusBox = styled(Box)`
  [data-eq-max~='0'] & {
    display: none;
  }
`
