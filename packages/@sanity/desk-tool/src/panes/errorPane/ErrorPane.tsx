import React from 'react'
import {Pane} from '../../components/pane'
import styles from './ErrorPane.css'

interface ErrorPaneProps {
  children: React.ReactNode
}

export default function ErrorPane(props: ErrorPaneProps) {
  return (
    <Pane tone="critical" title="Error" isSelected={false} isCollapsed={false}>
      <div className={styles.root}>{props.children}</div>
    </Pane>
  )
}
