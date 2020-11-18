import {ColorSchemeKey, Theme} from '@sanity/ui'
import {createGlobalStyle, css} from 'styled-components'

export const GlobalStyle = createGlobalStyle(
  ({scheme, theme}: {scheme: ColorSchemeKey; theme: Theme}) => {
    const _scheme = theme.color[scheme] || theme.color.light
    const tone = _scheme.card.tones.transparent
    const text = theme.fonts.text

    return css`
      body,
      html,
      #root {
        height: 100%;
      }

      body {
        background-color: ${tone.enabled.bg};
        color: ${tone.enabled.fg};
        font-family: ${text.family};
        font-size: 100%;
        line-height: ${text.sizes[2].lineHeight / text.sizes[2].fontSize};
        -webkit-font-smoothing: antialiased;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        margin: 0;
      }
    `
  }
)
