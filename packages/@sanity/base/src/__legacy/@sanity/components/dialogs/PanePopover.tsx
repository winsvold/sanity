import {
  CheckmarkCircleIcon,
  ErrorOutlineIcon,
  InfoOutlineIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import React from 'react'
import classNames from 'classnames'
import styles from './PanePopover.css'

interface PanePopoverProps {
  children?: React.ReactNode
  icon?: React.ReactNode | boolean
  kind?: 'info' | 'warning' | 'error' | 'success' | 'neutral'
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  id: string | number
}

const DEFAULT_ICONS = {
  info: <InfoOutlineIcon />,
  success: <CheckmarkCircleIcon />,
  warning: <WarningOutlineIcon />,
  error: <ErrorOutlineIcon />,
}

// @todo: refactor to functional component
export default class PanePopover extends React.PureComponent<PanePopoverProps> {
  iconKind = () => {
    const {icon, kind = 'info'} = this.props
    if (kind && typeof icon === 'boolean' && icon) return DEFAULT_ICONS[kind]
    if (typeof icon === 'object') return icon
    return undefined
  }

  render() {
    const {children, icon, id, kind = 'info', title, subtitle} = this.props
    const iconNode = this.iconKind()

    return (
      <div
        aria-label={kind}
        aria-describedby={`popoverTitle-${kind}-${id}`}
        className={classNames(styles.root, styles.dialog)}
        data-kind={kind}
      >
        <div className={styles.inner}>
          <div className={styles.content}>
            <div id={`popoverTitle-${kind}-${id}`} className={styles.title}>
              {icon && (
                <div role="img" aria-hidden className={styles.icon}>
                  {iconNode}
                </div>
              )}
              {title}
            </div>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            {children && <div className={styles.children}>{children}</div>}
          </div>
        </div>
      </div>
    )
  }
}
