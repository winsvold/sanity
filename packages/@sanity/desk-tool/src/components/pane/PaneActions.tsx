import {useId} from '@reach/auto-id'
import {MenuItem as MenuItemType, MenuItemGroup} from '@sanity/base/__legacy/components'
import {Button, Inline, Menu, MenuButton, MenuItem} from '@sanity/ui'
import React from 'react'

interface PaneActionsProps {
  menuItems?: MenuItemType[]
  menuGroups?: MenuItemGroup[]
}

export function PaneActions(props: PaneActionsProps) {
  const {menuItems = [], menuGroups} = props
  const actions = menuItems.filter(item => item.showAsAction)
  const items = menuItems.filter(item => !item.showAsAction)
  const menuId = useId()

  if (menuItems.length === 0) {
    return null
  }

  return (
    <Inline space={1}>
      {actions
        .map((action, actionIndex) => <Button icon={action.icon} key={actionIndex} mode="bleed" />)
        .concat(
          <MenuButton
            button={<Button icon="ellipsis-vertical" mode="bleed" />}
            id={menuId || ''}
            menu={
              <Menu>
                {items.map((item, itemIndex) => (
                  <MenuItem key={itemIndex} icon={item.icon} text={item.title} />
                ))}
              </Menu>
            }
          />
        )}
    </Inline>
  )
}
