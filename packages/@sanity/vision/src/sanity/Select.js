import {ChevronDownIcon} from '@sanity/icons'
import React from 'react'
import Dropdown from '../components/Dropdown'
import styles from '../css/select.css'

function Select(props) {
  return (
    <div className={styles.selectContainer}>
      <Dropdown className={styles.select} {...props} />
      <div className={styles.functions}>
        <div className={styles.icon}>
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  )
}

export default Select
