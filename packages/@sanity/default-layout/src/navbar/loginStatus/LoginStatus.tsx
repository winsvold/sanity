import {UserAvatar} from '@sanity/base/components'
import {ChevronDownIcon} from '@sanity/icons'
import {Menu, MenuItem, Popover, useClickOutside, useGlobalKeyDown} from '@sanity/ui'
import React, {useCallback, useState} from 'react'

import styles from './LoginStatus.css'

interface MenuItem {
  action: string
  icon: React.ComponentType<Record<string, unknown>>
  title: string
}

interface LoginStatusProps {
  onLogout: () => void
}

export function LoginStatus(props: LoginStatusProps) {
  const {onLogout} = props
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null)
  const [menuElement, setMenuElement] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)

  const handleButtonClick = useCallback(() => setOpen(val => !val), [])

  const popoverContent = (
    <Menu ref={setMenuElement}>
      <MenuItem icon="leave" onClick={onLogout}>
        Sign out
      </MenuItem>
    </Menu>
  )

  useClickOutside(
    useCallback(() => {
      setOpen(false)
    }, []),
    [buttonElement, menuElement]
  )

  useGlobalKeyDown(
    useCallback(
      (event: KeyboardEvent) => {
        if (!open) return
        if (event.key === 'Escape') {
          event.stopPropagation()
          setOpen(false)
        }
      },
      [open]
    )
  )

  return (
    <button
      className={styles.root}
      onClick={handleButtonClick}
      ref={setButtonElement}
      title="Toggle user menu"
      type="button"
    >
      <div className={styles.inner} tabIndex={-1}>
        <Popover content={popoverContent} open={open} placement="bottom-end">
          <div className={styles.avatarContainer}>
            <UserAvatar size={1} tone="navbar" userId="me" />
          </div>
        </Popover>

        <div className={styles.iconContainer}>
          <ChevronDownIcon data-sanity-icon />
        </div>
      </div>
    </button>
  )
}
