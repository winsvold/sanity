import {DefaultGridListItem} from '@sanity/base/__legacy/components'
import React, {useContext} from 'react'
import {PaneRouterContext} from '../../contexts/PaneRouterContext'
import listStyles from '../../components/listView/ListView.css'
import styles from './PaneItem.css'

interface PaneItemWrapperProps {
  id: string
  layout?: string
  useGrid?: boolean
  isSelected?: boolean
  children?: React.ReactNode
}

const PaneItemWrapper = (props: PaneItemWrapperProps) => {
  const {ChildLink} = useContext(PaneRouterContext)
  const {id, useGrid, layout, isSelected} = props

  const link = (
    <ChildLink childId={id} className={isSelected ? styles.linkIsSelected : styles.link}>
      {props.children}
    </ChildLink>
  )

  return useGrid ? (
    <DefaultGridListItem className={listStyles[`${layout}ListItem`]}>{link}</DefaultGridListItem>
  ) : (
    <div className={isSelected ? styles.selected : styles.item}>{link}</div>
  )
}

export default PaneItemWrapper
