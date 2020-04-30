import React, {useState} from 'react'
import UsersIcon from 'part:@sanity/base/users-icon'
import useCollaborators from 'part:@sanity/base/hooks/collaborators'
import styles from './GlobalStatus.css'
import PopoverList from './PopoverList'
import AvatarProvider from './AvatarProvider'
import {MAX_AVATARS} from './constants'
import {splitRight} from './utils'
import client from 'part:@sanity/base/client'
import {uniqBy} from 'lodash'
import StackCounter from './StackCounter'

const {projectId} = client.config()

export default function GlobalStatus() {
  const users = useCollaborators()
  const [hiddenUsers, visibleUsers] = splitRight(uniqBy(users, user => user.identity))
  const showCounter = hiddenUsers.length >= MAX_AVATARS - 1 || users.length === 0
  return (
    <div className={styles.root}>
      <PopoverList
        userList={users}
        avatarSize="medium"
        isGlobal
        projectId={projectId}
        trigger="click"
      >
        <div className={styles.inner} tabIndex={-1}>
          {/* Only show this on mobile */}
          <div className={styles.mobileContent}>
            <div className={styles.icon}>
              {users.length > 0 && (
                <div className={styles.statusIndicator} aria-label={`Online collaborators`} />
              )}
              <UsersIcon />
            </div>
          </div>
          {/* Show avatars laid out like on a field */}
          <div className={styles.avatars}>
            {showCounter && <StackCounter count={hiddenUsers.length} />}
            {visibleUsers.map(user => (
              <div className={styles.avatarOverlap} key={user.identity}>
                <AvatarProvider userId={user.identity} fillColor="currentColor" color="#ea5fb1" />
              </div>
            ))}
          </div>
        </div>
      </PopoverList>
    </div>
  )
}
