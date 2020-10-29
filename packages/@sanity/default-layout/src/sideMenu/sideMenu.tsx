import {UserAvatar} from '@sanity/base/components'
import {Button, Card} from '@sanity/ui'
import classNames from 'classnames'
import React from 'react'
import {ToolMenu} from '../components'
import {DatasetSelect} from '../datasetSelect'
import {Tool, User} from '../types'
import {HAS_SPACES} from '../util/spaces'

import styles from './sideMenu.css'

interface Props {
  activeToolName: string | null
  isOpen: boolean
  onClose: () => void
  onSignOut: () => void
  onSwitchTool: () => void
  tools: Tool[]
  user: User
}

export function SideMenu(props: Props) {
  const {activeToolName, isOpen, onClose, onSignOut, onSwitchTool, tools, user} = props
  const tabIndex = isOpen ? 0 : -1

  return (
    <div className={classNames(styles.root, isOpen && styles.isOpen)}>
      <Card shadow={1}>
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.userProfile}>
              <div className={styles.userAvatarContainer}>
                <UserAvatar size={1} userId="me" />
              </div>
              <div className={styles.userProfileText}>{user?.name || user?.email}</div>
            </div>

            <div className={styles.closeButtonContainer}>
              <Button
                icon="close"
                // icon={CloseIcon}
                mode="bleed"
                onClick={onClose}
                padding={2}
                tabIndex={tabIndex}
                title="Close menu"
              />
            </div>
          </div>

          {HAS_SPACES && (
            <div className={styles.datasetSelectContainer}>
              <DatasetSelect />
            </div>
          )}
        </div>

        <div className={styles.toolSwitcher}>
          <ToolMenu
            activeToolName={activeToolName}
            direction="vertical"
            onSwitchTool={onSwitchTool}
            tools={tools}
          />
        </div>

        <div className={styles.menuBottom}>
          <div className={styles.signOutButton}>
            <Button
              icon="leave"
              // icon={LeaveIcon}
              mode="bleed"
              onClick={onSignOut}
              tabIndex={tabIndex}
            >
              Sign out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
