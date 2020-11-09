import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import {MenuItem as MenuItemType, MenuItemGroup} from '@sanity/base/__legacy/components'
import IconMoreVert from 'part:@sanity/base/more-vert-icon'
import React, {useMemo} from 'react'

import styles from './contextMenu.css'

interface DocumentPanelContextMenuProps {
  boundaryElement: HTMLDivElement | null
  isCollapsed: boolean
  items: MenuItemType[]
  itemGroups: MenuItemGroup[]
  onAction: (action: MenuItemType) => void
  open: boolean
  setOpen: (val: boolean) => void
}

export function DocumentPanelContextMenu(props: DocumentPanelContextMenuProps) {
  const {boundaryElement, isCollapsed, open, items, itemGroups, onAction, setOpen} = props

  const id = useMemo(
    () =>
      Math.random()
        .toString(36)
        .substr(2, 6),
    []
  )

  // const handleAction = useCallback(
  //   (action: MenuItemType) => {
  //     onAction(action)
  //     setOpen(false)
  //   },
  //   [onAction, setOpen]
  // )

  // const handleCloseMenu = useCallback(() => {
  //   setOpen(false)
  // }, [setOpen])

  // console.log(items, itemGroups)

  return (
    <MenuButton
      boundaryElement={boundaryElement || undefined}
      button={
        <Button
          aria-label="Menu"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={id}
          className={styles.menuOverflowButton}
          icon={IconMoreVert}
          // kind: 'simple',
          // padding: 'small',
          mode="bleed"
          padding={2}
          selected={open}
          title="Show menu"
        />
      }
      id="context-menu"
      menu={
        <Menu
          id={id}
          // items={items}
          // groups={itemGroups}
          // onAction={handleAction}
          // onClose={handleCloseMenu}
        >
          {/* @todo: use item groups */}
          {items.map((item, itemIndex) => (
            <MenuItem
              // icon={item.icon}
              key={item.key || itemIndex}
              onClick={() => onAction(item)}
              text={item.title}
            />
          ))}
        </Menu>
      }
      // open={open}
      placement="bottom"
      // setOpen={setOpen}
    />
  )
}
