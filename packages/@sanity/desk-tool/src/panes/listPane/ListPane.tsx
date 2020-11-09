import React from 'react'
import listStyles from 'part:@sanity/components/lists/default-style'
import {Pane, PaneActions} from '../../components/pane'
import {PaneRouterContext} from '../../contexts/PaneRouterContext'
import {PaneItem} from '../../components/paneItem'
import {ListView} from '../../components/listView'

interface ListPaneProps {
  index: number
  title: string
  childItemId: string
  className?: string
  styles?: Record<string, string>
  defaultLayout?: string
  items?: {
    id: string
    type: string
    schemaType?: {name?: string}
  }[]
  menuItems?: {
    title: string
  }[]
  menuItemGroups?: {
    id: string
  }[]
  displayOptions?: {
    showIcons?: boolean
  }
  isSelected: boolean
  isCollapsed: boolean
  onExpand?: () => void
  onCollapse?: () => void
}

export default class ListPane extends React.PureComponent<ListPaneProps> {
  static contextType = PaneRouterContext

  static defaultProps = {
    className: '',
    items: [],
    menuItems: [],
    menuItemGroups: [],
    displayOptions: {},
    styles: undefined,
    onExpand: undefined,
    onCollapse: undefined,
    defaultLayout: undefined
  }

  itemIsSelected(item) {
    return this.props.childItemId === item.id
  }

  shouldShowIconForItem = item => {
    const paneShowIcons = this.props.displayOptions.showIcons
    const itemShowIcon = item.displayOptions && item.displayOptions.showIcon

    // Specific true/false on item should have presedence over list setting
    if (typeof itemShowIcon !== 'undefined') {
      return itemShowIcon === false ? false : item.icon
    }

    // If no item setting is defined, defer to the pane settings
    return paneShowIcons === false ? false : item.icon
  }

  render() {
    const {
      title,
      styles,
      className,
      defaultLayout,
      items,
      index,
      menuItems,
      menuItemGroups,
      isSelected,
      isCollapsed,
      onCollapse,
      onExpand
    } = this.props

    return (
      <Pane
        actions={<PaneActions menuItems={menuItems} menuItemGroups={menuItemGroups} />}
        index={index}
        title={title}
        styles={styles}
        className={className}
        isSelected={isSelected}
        isCollapsed={isCollapsed}
        onCollapse={onCollapse}
        onExpand={onExpand}
      >
        <ListView layout={defaultLayout}>
          {items.map(item =>
            item.type === 'divider' ? (
              <hr key={item.id} className={listStyles.divider} />
            ) : (
              <PaneItem
                key={item.id}
                id={item.id}
                index={index}
                value={item}
                icon={this.shouldShowIconForItem(item)}
                layout={defaultLayout}
                isSelected={this.itemIsSelected(item)}
                schemaType={item.schemaType}
              />
            )
          )}
        </ListView>
      </Pane>
    )
  }
}
