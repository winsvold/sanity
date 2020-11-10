import {EyeClosedIcon} from '@sanity/icons'
import React from 'react'
import {Tooltip} from 'part:@sanity/components/tooltip'
import styles from './ItemStatus.css'

const NotPublishedStatus = () => (
  <Tooltip className={styles.itemStatus} content={<>Not published</>}>
    <i>
      <EyeClosedIcon />
    </i>
  </Tooltip>
)

export default NotPublishedStatus
