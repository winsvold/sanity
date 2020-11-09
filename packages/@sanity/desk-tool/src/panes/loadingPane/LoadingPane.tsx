import {Spinner} from '@sanity/base'
import React from 'react'
import {Subscription} from 'rxjs'
import {Pane} from '../../components/pane'
import styles from './LoadingPane.css'

interface LoadingPaneProps {
  title?: string
  isSelected: boolean
  isCollapsed: boolean
  onExpand?: () => void
  onCollapse?: () => void
  path: string[]
  index: number
  message: string | (() => string)
}

export default class LoadingPane extends React.PureComponent<LoadingPaneProps> {
  static defaultProps = {
    // message: 'Loading…',
    path: [],
    title: '\u00a0',
    index: undefined,
    onExpand: undefined,
    onCollapse: undefined
  }

  subscription?: Subscription

  constructor(props: LoadingPaneProps) {
    super(props)

    const isGetter = typeof props.message === 'function'
    const currentMessage = isGetter ? props.message(props.path) : props.message
    const isObservable = currentMessage && typeof currentMessage.subscribe === 'function'
    const state = {currentMessage: isObservable ? LoadingPane.defaultProps.message : currentMessage}

    if (isObservable) {
      let isSync = true
      this.subscription = currentMessage.subscribe(message => {
        if (isSync) {
          state.currentMessage = message
        } else {
          this.setState({currentMessage: message})
        }
      })
      isSync = false
    }

    this.state = state
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  render() {
    const {isSelected, isCollapsed, onCollapse, onExpand, title} = this.props
    const {currentMessage} = this.state

    return (
      <Pane
        title={title}
        isLoading
        isScrollable={false}
        isSelected={isSelected}
        isCollapsed={isCollapsed}
        onCollapse={onCollapse}
        onExpand={onExpand}
        index={this.props.index}
      >
        {/* div wrapper to match styling of documents list pane - prevents spinner
         * from jumping to new position when pane definition is loaded */}
        <div className={styles.root}>
          <Spinner center message={currentMessage} />
        </div>
      </Pane>
    )
  }
}
