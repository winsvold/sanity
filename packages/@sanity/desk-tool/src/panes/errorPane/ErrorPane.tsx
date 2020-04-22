/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-filename-extension */

import React from 'react'
import DefaultPane from 'part:@sanity/components/panes/default'
import styles from './ErrorPane.css'

interface Props {
  children?: React.ReactNode
  color?: 'info' | 'success' | 'warning' | 'danger'
  isCollapsed?: boolean
  isScrollable?: boolean
  isSelected?: boolean
  title?: React.ReactNode
}

export default function ErrorPane(props: Props) {
  return (
    <DefaultPane
      color={props.color || 'error'}
      isCollapsed={props.isCollapsed}
      isScrollable={props.isScrollable}
      isSelected={props.isSelected}
      title={props.title || 'Error'}
    >
      <div className={styles.root}>{props.children}</div>
    </DefaultPane>
  )
}
