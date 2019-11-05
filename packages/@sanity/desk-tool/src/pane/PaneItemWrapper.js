import styles from './styles/PaneItem.css'
import listStyles from './styles/ListView.css'
import PropTypes from 'prop-types'
import React from 'react'
import {Item as GridListItem} from 'part:@sanity/components/lists/grid'
import {PaneContext} from '../index'

const PaneItemWrapper = props => (
  <PaneContext.Consumer>
    {({ChildLink}) => {
      const {id, useGrid, layout, isSelected} = props
      const link = (
        <ChildLink childId={id} className={isSelected ? styles.linkIsSelected : styles.link}>
          {props.children}
        </ChildLink>
      )

      return useGrid ? (
        <GridListItem className={listStyles[`${layout}ListItem`]}>{link}</GridListItem>
      ) : (
        <div className={isSelected ? styles.selected : styles.item}>{link}</div>
      )
    }}
  </PaneContext.Consumer>
)

PaneItemWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  layout: PropTypes.string,
  useGrid: PropTypes.bool,
  isSelected: PropTypes.bool,
  children: PropTypes.node
}

export default PaneItemWrapper
