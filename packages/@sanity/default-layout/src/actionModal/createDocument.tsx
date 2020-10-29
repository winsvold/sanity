import {Box, rem} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import CreateDocumentPreview from './createDocumentPreview'

const Root = styled(Box)`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  grid-gap: ${({theme}) => rem(theme.space[3])};
`

export interface CreateDocumentPreviewItem {
  key: string
  title?: string
  subtitle?: string
  icon?: React.ComponentType<unknown>
  onClick?: () => void
}

interface CreateDocumentListProps {
  items: CreateDocumentPreviewItem[]
}

function CreateDocumentList(props: CreateDocumentListProps) {
  const {items = []} = props

  return (
    <Root forwardedAs="ul" padding={4}>
      {items.map(item => (
        <li key={item.key}>
          <CreateDocumentPreview {...item} />
        </li>
      ))}
    </Root>
  )
}

export default CreateDocumentList
