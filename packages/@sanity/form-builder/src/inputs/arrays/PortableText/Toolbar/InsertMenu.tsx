import {useId} from '@reach/auto-id'
import {AddIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import React, {useCallback} from 'react'
import {BlockItem} from './types'

interface InsertMenuProps {
  disabled: boolean
  items: BlockItem[]
  readOnly: boolean
}

export default function InsertMenu(props: InsertMenuProps) {
  const {disabled, items, readOnly} = props
  const id = useId()

  return (
    <MenuButton
      button={
        <Button
          aria-label="Insert elements"
          aria-haspopup="menu"
          aria-controls="insertmenu"
          disabled={disabled || readOnly}
          icon={AddIcon}
          mode="bleed"
          padding={2}
          title="Insert elements"
        />
      }
      id={id}
      menu={
        <Menu>
          {items.map((item) => (
            <InsertMenuItem item={item} key={item.key} />
          ))}
        </Menu>
      }
      placement="bottom"
      portal
    />
  )
}

function InsertMenuItem({item}: {item: BlockItem}) {
  const handleClick = useCallback(() => {
    item.handle()
  }, [item])

  const title = item.type.title || item.type.type.name

  return (
    <MenuItem
      aria-label={`Insert ${title}${item.inline ? ' (inline)' : ' (block)'}`}
      as="button"
      disabled={item.disabled}
      icon={item.icon}
      onClick={handleClick}
      title={`Insert ${title}${item.inline ? ' (inline)' : ' (block)'}`}
      text={title}
    />
  )
}
