import React from 'react'
import {IntentLink} from 'part:@sanity/base/router'

import styles from './BlockObjectMenuItem.css'

// This component renders the dropdown button menu on the block object's preview

export type DropDownMenuItemProps = {
  title: string
  icon: React.ComponentType
  color?: string
  intent?: 'edit' | string
  params?: Record<string, any>
  name?: string
}

export function MenuItem({title, color, icon, intent, params}: DropDownMenuItemProps) {
  const Icon = icon
  return (
    <div className={color === 'danger' ? styles.menuItemDanger : styles.menuItem}>
      {intent ? (
        <IntentLink className={styles.intentLink} intent={intent} params={params}>
          <div className={styles.iconContainer}>{Icon && <Icon />}</div>
          <div className={styles.title}>{title}</div>
        </IntentLink>
      ) : (
        <>
          <div className={styles.iconContainer}>{Icon && <Icon />}</div>
          <div className={styles.title}>{title}</div>
        </>
      )}
    </div>
  )
}
