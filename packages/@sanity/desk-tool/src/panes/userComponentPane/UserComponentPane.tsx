import React from 'react'
import {Pane} from '../../components/pane'
import userComponentPaneStyles from './UserComponentPane.css'

function noActionFn() {
  // eslint-disable-next-line no-console
  console.warn('No handler defined for action')
}

interface UserComponentPaneProps {
  styles?: Record<string, string>
  title?: string
  index: number
  type: string
  component: React.ComponentType | React.ReactNode
  options?: Record<string, any>
  isSelected: boolean
  isCollapsed: boolean
  onExpand?: () => void
  onCollapse?: () => void
  renderActions?: () => void
  menuItems?: {
    title: string
  }[]
  menuItemGroups?: {
    id: string
  }[]
}

export default class UserComponentPane extends React.PureComponent<UserComponentPaneProps> {
  static defaultProps = {
    title: '',
    options: {},
    menuItems: [],
    menuItemGroups: [],
    styles: undefined,
    onExpand: undefined,
    onCollapse: undefined,
    renderActions: undefined
  }

  userComponent?: React.RefObject<any>

  constructor(props: UserComponentPaneProps) {
    super(props)

    this.userComponent = React.createRef()
  }

  handleAction = item => {
    let handler
    if (typeof item.action === 'function') {
      handler = item.action
    } else {
      handler =
        this.userComponent &&
        this.userComponent.current &&
        this.userComponent.current.actionHandlers &&
        this.userComponent.current.actionHandlers[item.action]
    }

    if (handler) {
      handler(item.params, this)
    } else {
      noActionFn()
    }
  }

  render() {
    const {
      isSelected,
      isCollapsed,
      onCollapse,
      onExpand,
      component,
      index,
      styles,
      title,
      type,
      menuItems,
      menuItemGroups,
      renderActions,
      ...rest
    } = this.props

    const hideHeader = !title && !menuItems.length && !renderActions
    const paneStyles = hideHeader ? {header: userComponentPaneStyles.noHeader} : {}
    const UserComponent = typeof component === 'function' && component

    return (
      <Pane
        styles={paneStyles}
        title={title}
        menuItems={menuItems}
        menuItemGroups={menuItemGroups}
        isSelected={isSelected}
        isCollapsed={isCollapsed}
        onCollapse={onCollapse}
        onExpand={onExpand}
        onAction={this.handleAction}
      >
        {UserComponent ? <UserComponent ref={this.userComponent} {...rest} /> : component}
      </Pane>
    )
  }
}
