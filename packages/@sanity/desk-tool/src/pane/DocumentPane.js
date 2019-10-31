import React from 'react'
import PropTypes from 'prop-types'
import DefaultPane from 'part:@sanity/components/panes/default'

function noActionFn() {
  // eslint-disable-next-line no-console
  console.warn('No handler defined for action')
}

export default class DocumentPane extends React.PureComponent {
  static propTypes = {
    styles: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    title: PropTypes.string,
    index: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    isSelected: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func,
    renderActions: PropTypes.func,
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired
      })
    ),
    menuItemGroups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    )
  }

  static defaultProps = {
    title: '',
    menuItems: [],
    menuItemGroups: [],
    styles: undefined,
    onExpand: undefined,
    onCollapse: undefined,
    renderActions: undefined
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
      type,
      menuItems,
      menuItemGroups,
      renderActions,
      ...rest
    } = this.props

    return (
      <DefaultPane
        title="Foo"
        menuItems={menuItems}
        menuItemGroups={menuItemGroups}
        isSelected={isSelected}
        isCollapsed={isCollapsed}
        onCollapse={onCollapse}
        onExpand={onExpand}
        onAction={this.handleAction}
      >
        <pre>
          <code>{JSON.stringify(rest, null, 2)}</code>
        </pre>
      </DefaultPane>
    )
  }
}
