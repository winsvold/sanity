import {UserAvatar} from '@sanity/base/components'
import {Menu, MenuButton, MenuItem} from '@sanity/ui'
import React from 'react'

interface LoginStatusProps {
  onLogout: () => void
}

export function LoginStatus({onLogout}: LoginStatusProps) {
  return (
    <MenuButton
      button={<UserAvatar as="button" size={1} userId="me" />}
      id="user-menu"
      menu={
        <Menu>
          <MenuItem iconRight="leave" onClick={onLogout} text="Sign out" />
        </Menu>
      }
      // portal
    />
  )
}
