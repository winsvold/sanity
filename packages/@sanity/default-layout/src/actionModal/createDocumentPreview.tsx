import {Box, Stack, Text} from '@sanity/ui'
import {IntentLink} from 'part:@sanity/base/router'
import React from 'react'
import styled from 'styled-components'

const Root = styled(IntentLink)`
  display: block;
  text-decoration: none;
  position: relative;
  background-color: var(--card-bg-color);
  border-radius: ${({theme}) => `${theme.radius[2]}px`};
  border: 1px solid var(--card-hairline-soft-color);
  height: 100%;
  box-sizing: border-box;
  outline: none;

  @media (hover: hover) {
    color: var(--card-fg-muted-color);

    &:hover {
      color: var(--card-fg-color);
    }
  }

  &:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2px var(--card-focus-ring-color);
  }
`

const Container = styled(Box)`
  display: flex;
  align-items: center;
`

const TextContainer = styled(Stack)`
  flex: 1;
  min-width: 0;
  margin-left: 12px;
`

const MediaContainer = styled.div`
  float: right;
  display: flex;
  align-items: flex-start;
  width: calc(33 / 16 * 1em);
  height: calc(33 / 16 * 1em);

  & > svg {
    display: block;
    font-size: calc(25 / 16 * 1em);
    margin: calc(4 / 25 * 1em);

    &[data-sanity-icon='true'] {
      font-size: calc(37 / 16 * 1em);
      margin: calc(2 / 37 * -1em);
    }
  }
`

interface CreateDocumentPreviewProps {
  title?: React.ReactNode | React.FunctionComponent<unknown>
  subtitle?: React.ReactNode | React.FunctionComponent<{layout: 'default'}>
  description?: React.ReactNode | React.FunctionComponent<unknown>
  media?: React.ReactNode | React.FunctionComponent<unknown>
  icon?: React.ComponentType<unknown>
  isPlaceholder?: boolean
  params?: {
    intent: 'create'
    template?: string
  }
  templateParams?: Record<string, unknown>
  onClick?: () => void
}

export class CreateDocumentPreview extends React.PureComponent<CreateDocumentPreviewProps> {
  render() {
    const {
      title = 'Untitled',
      subtitle,
      media = this.props.icon,
      isPlaceholder,
      description,
      params,
      templateParams
    } = this.props

    if (isPlaceholder || !params) {
      return (
        <Container padding={3}>
          {media !== false && <MediaContainer />}
          <TextContainer space={2}>
            <Text as="h2">Loading…</Text>
            <Text as="h3" size={1}>
              Loading…
            </Text>
          </TextContainer>
        </Container>
      )
    }

    return (
      <Root
        intent="create"
        params={[params, templateParams]}
        title={subtitle ? `Create new ${title} (${subtitle})` : `Create new ${title}`}
        onClick={this.props.onClick}
      >
        <Container padding={3}>
          {media !== false && (
            <MediaContainer>
              {typeof media === 'function' && media({layout: 'default'})}
              {React.isValidElement(media) && media}
            </MediaContainer>
          )}

          <TextContainer space={2}>
            <Text as="h2">
              {typeof title !== 'function' && title}
              {typeof title === 'function' && title({layout: 'default'})}
            </Text>

            {subtitle && (
              <Text as="h3" size={1}>
                {(typeof subtitle === 'function' && subtitle({layout: 'default'})) || subtitle}
              </Text>
            )}
          </TextContainer>

          {description && <Text size={0}>{description}</Text>}
        </Container>
      </Root>
    )
  }
}
