import {DefaultGridList} from '@sanity/base/__legacy/components'
import React from 'react'
import styles from './ListView.css'

interface ListViewProps {
  layout?: 'default' | 'detail' | 'card' | 'media'
  children: React.ReactNode
}

export default class ListView extends React.PureComponent<ListViewProps> {
  render() {
    const {layout = 'default', children} = this.props

    if (layout === 'card') {
      return <DefaultGridList className={styles.cardList}>{children}</DefaultGridList>
    }

    if (layout === 'media') {
      return <DefaultGridList className={styles.mediaList}>{children}</DefaultGridList>
    }

    return children
  }
}
