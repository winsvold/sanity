import {Tooltip} from '@sanity/ui'
import React from 'react'
import VisibilityOffIcon from 'part:@sanity/base/visibility-off-icon'
import styles from './ItemStatus.css'

const NotPublishedStatus = () => (
  <Tooltip className={styles.itemStatus} content={<>Not published</>}>
    <i>
      <VisibilityOffIcon />
    </i>
  </Tooltip>
)

export default NotPublishedStatus
