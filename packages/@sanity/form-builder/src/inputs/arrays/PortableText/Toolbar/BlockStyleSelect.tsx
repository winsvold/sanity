import {useId} from '@reach/auto-id'
import {ChevronDownIcon} from '@sanity/icons'
import {
  PortableTextEditor,
  RenderBlockFunction,
  usePortableTextEditor,
} from '@sanity/portable-text-editor'
import {Box, Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import React, {createRef, useCallback, useEffect, useMemo, useState} from 'react'
import {BlockStyleItem} from './types'

interface BlockStyleSelectProps {
  disabled: boolean
  readOnly: boolean
  renderBlock: RenderBlockFunction
  items: BlockStyleItem[]
  value: BlockStyleItem[]
}

export function BlockStyleSelect(props: BlockStyleSelectProps) {
  const {disabled, items, readOnly, renderBlock, value} = props
  const editor = usePortableTextEditor()
  const [changed, setChanged] = useState(false)
  const id = useId()
  const features = useMemo(() => PortableTextEditor.getPortableTextFeatures(editor), [editor])

  // Use this effect to set focus back into the editor when the new value get's in.
  useEffect(() => {
    if (changed) {
      PortableTextEditor.focus(editor)
      setChanged(false)
    }
  }, [editor, changed])

  const handleChange = useCallback(
    (item: BlockStyleItem): void => {
      const focusBlock = PortableTextEditor.focusBlock(editor)
      if (focusBlock && item.style !== focusBlock.style) {
        PortableTextEditor.toggleBlockStyle(editor, item.style)
      }
      setChanged(true)
    },
    [editor]
  )

  const renderItem = useCallback(
    (item: BlockStyleItem): JSX.Element => {
      if (item.style) {
        const StyleComponent = item.styleComponent

        return renderBlock(
          {
            _key: '1',
            _type: features.types.block.name,
            children: [
              {
                _key: '2',
                _type: features.types.span.name,
                text: item.title,
              },
            ],
            style: item.style,
          },
          features.types.block,
          {focused: false, selected: false, path: []},
          () =>
            StyleComponent ? <StyleComponent>{item.title}</StyleComponent> : <>{item.title}</>,
          // @todo: remove this:
          createRef()
        )
      }

      return <div key={item.key}>No style</div>
    },
    [features, renderBlock]
  )

  const focusBlock = PortableTextEditor.focusBlock(editor)

  // @todo: Document what's going on here
  const _disabled = focusBlock ? features.types.block.name !== focusBlock._type : false

  return (
    <MenuButton
      button={
        <Button
          disabled={readOnly || disabled || _disabled}
          iconRight={ChevronDownIcon}
          mode="bleed"
          padding={2}
          text={value[0] && value[0].title}
        />
      }
      id={id}
      menu={
        <Menu>
          {items.map((item) => (
            <BlockStyleMenuItem item={item} key={item.key} onClick={handleChange}>
              {renderItem(item)}
            </BlockStyleMenuItem>
          ))}
        </Menu>
      }
      placement="bottom-start"
      portal
    />
  )
}

function BlockStyleMenuItem({
  children,
  item,
  onClick,
}: {
  children: React.ReactNode
  item: BlockStyleItem
  onClick: (i: BlockStyleItem) => void
}) {
  const handleClick = useCallback(() => onClick(item), [item, onClick])

  return (
    <MenuItem onClick={handleClick}>
      <Box paddingX={3}>{children}</Box>
    </MenuItem>
  )
}
