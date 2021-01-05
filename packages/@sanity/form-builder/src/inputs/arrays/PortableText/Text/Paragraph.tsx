import React from 'react'
import styles from './Paragraph.css'

interface Props {
  children: React.ReactNode
}

export function Paragraph(props: Props) {
  return <div className={styles.root}>{props.children}</div>
}
