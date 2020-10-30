import {UserAvatar} from '@sanity/base/components'
import {Menu, MenuButton, MenuItem} from '@sanity/ui'
import React from 'react'
import {useCurrentUser} from '../../../lib/user/hooks'

export function LoginStatus() {
  const {logout} = useCurrentUser()

  return (
    <MenuButton
      button={<UserAvatar as="button" size={1} userId="me" />}
      id="user-menu"
      menu={
        <Menu>
          <MenuItem iconRight="leave" onClick={logout} text="Sign out" />
        </Menu>
      }
      portal
    />
  )
}
