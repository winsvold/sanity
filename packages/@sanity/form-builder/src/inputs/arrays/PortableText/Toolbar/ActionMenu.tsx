import {PortableTextEditor, usePortableTextEditor} from '@sanity/portable-text-editor'
import {Button, MenuItem} from '@sanity/ui'
import React, {useCallback} from 'react'
import {OverflowMenu} from './OverflowMenu'
import {PTEToolbarAction, PTEToolbarActionGroup} from './types'

interface ActionButtonProps {
  action: PTEToolbarAction
  disabled: boolean
  visible: boolean
}

function ActionButton(props: ActionButtonProps) {
  const {action, disabled, visible} = props
  const title = action.hotkeys ? `${action.title} (${action.hotkeys.join('+')})` : action.title

  const handleClick = useCallback(() => {
    action.handle()
  }, [action])

  return (
    <Button
      aria-hidden={!visible}
      data-visible={visible}
      disabled={disabled}
      icon={action.icon}
      mode="bleed"
      padding={2}
      onClick={handleClick}
      selected={action.active}
      tabIndex={visible ? 0 : -1}
      title={title}
    />
  )
}

interface ActionMenuItemProps {
  action: PTEToolbarAction
  disabled: boolean
}

function ActionMenuItem(props: ActionMenuItemProps) {
  const {action, disabled} = props
  const title = action.hotkeys ? `${action.title} (${action.hotkeys.join('+')})` : action.title

  const handleClick = useCallback(() => action.handle(), [action])

  return (
    <MenuItem
      disabled={disabled}
      icon={action.icon}
      onClick={handleClick}
      selected={action.active}
      text={title}
    />
  )
}

interface ActionMenuProps {
  disabled: boolean
  groups: PTEToolbarActionGroup[]
  readOnly: boolean
}

export function ActionMenu(props: ActionMenuProps) {
  const {disabled, groups, readOnly} = props
  const editor = usePortableTextEditor()
  const focusBlock = PortableTextEditor.focusBlock(editor)
  const focusChild = PortableTextEditor.focusChild(editor)
  const ptFeatures = PortableTextEditor.getPortableTextFeatures(editor)

  const isNotText =
    (focusBlock && focusBlock._type !== ptFeatures.types.block.name) ||
    (focusChild && focusChild._type !== ptFeatures.types.span.name)

  const actions = groups.reduce((acc: PTEToolbarAction[], group) => {
    return acc.concat(
      group.actions.map((action, actionIndex) => {
        if (actionIndex === 0) return {...action, firstInGroup: true}
        return action
      })
    )
  }, [])

  return (
    <OverflowMenu
      actions={actions}
      actionButtonComponent={ActionButton}
      actionMenuItemComponent={ActionMenuItem}
      disabled={disabled || readOnly || isNotText}
    />
  )
}
