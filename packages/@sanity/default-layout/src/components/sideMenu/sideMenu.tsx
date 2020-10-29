import {UserAvatar} from '@sanity/base/components'
import {Button, Card} from '@sanity/ui'
import classNames from 'classnames'
import React from 'react'
import {ToolMenu} from '../toolMenu'
import {useCurrentUser} from '../../lib/user/hooks'
import {DatasetSelect} from '../../lib/__experimental_spaces/components'
import {HAS_SPACES} from '../../lib/__experimental_spaces/constants'
import {Tool} from '../tool'

import styles from './sideMenu.css'

interface Props {
  activeToolName: string | null
  isOpen: boolean
  onClose: () => void
  onSwitchTool: () => void
  tools: Tool[]
}

export function SideMenu(props: Props) {
  const {activeToolName, isOpen, onClose, onSwitchTool, tools} = props
  const tabIndex = isOpen ? 0 : -1
  const {data: user, logout} = useCurrentUser()

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
              onClick={logout}
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
