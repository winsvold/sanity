import classNames from 'classnames'
import React, {createContext, useContext} from 'react'
import SplitPane from 'react-split-pane'

import styles from './SplitController.css'

export interface PaneType {
  defaultSize: number
  element: React.ReactElement
  index: number
  isCollapsed: boolean
  key: string
  minSize: number
  maxSize?: number
}

interface SplitControllerProps {
  // children: React.ReactNode
  collapsedWidth?: number
  isMobile?: boolean
  panes: PaneType[]
}

export const PaneContext = createContext<{index: number; isCollapsed: boolean}>({
  index: -1,
  isCollapsed: true
})

export function usePane() {
  return useContext(PaneContext)
}

export function PaneProvider({
  children,
  index,
  isCollapsed
}: {
  children: React.ReactNode
  index: number
  isCollapsed: boolean
}) {
  return <PaneContext.Provider value={{index, isCollapsed}}>{children}</PaneContext.Provider>
}

export default class PanesSplitController extends React.PureComponent<SplitControllerProps> {
  state = {
    isResizing: false
  }

  handleDragStarted = () => {
    this.setState({
      isResizing: true
    })
  }

  handleDragFinished = () => {
    this.setState({
      isResizing: false
    })
  }

  // eslint-disable-next-line complexity
  renderSplitPane = (
    leftPane: PaneType,
    rightPaneElement: React.ReactElement | null,
    index: number
  ) => {
    const {collapsedWidth} = this.props
    const {isResizing} = this.state
    const isCollapsed = leftPane && leftPane.isCollapsed
    const size = isCollapsed ? collapsedWidth : undefined
    const minSize = leftPane ? leftPane.minSize : Infinity
    const defaultSize = leftPane ? leftPane.defaultSize : Infinity
    const element = leftPane ? leftPane.element : undefined

    return (
      <div
        className={classNames(
          styles.root,
          isResizing ? styles.splitWrapperResizing : styles.splitWrapper,
          rightPaneElement ? '' : styles.singleWrapper,
          isCollapsed && styles.collapsed
        )}
      >
        <SplitPane
          minSize={isCollapsed ? collapsedWidth : minSize}
          defaultSize={isCollapsed ? collapsedWidth : defaultSize}
          size={size}
          resizerClassName={styles.resizer}
          allowResize={!isCollapsed}
          className={styles.splitPane}
          onDragStarted={this.handleDragStarted}
          onDragFinished={this.handleDragFinished}
        >
          <PaneProvider index={index} isCollapsed={isCollapsed}>
            {element}
          </PaneProvider>

          {rightPaneElement ? (
            <PaneProvider index={index + 1} isCollapsed={false}>
              {rightPaneElement}
            </PaneProvider>
          ) : (
            <div style={{display: 'none'}} />
          )}
        </SplitPane>
      </div>
    )
  }

  renderRecursivePanes = (panes: PaneType[], index: number) => {
    // only 1 pane left
    if (panes.length === 1) {
      return (
        <PaneProvider index={index} isCollapsed={false}>
          {panes[0].element}
        </PaneProvider>
      )
    }

    // only 2 panes left
    if (panes.length === 2) {
      return this.renderSplitPane(panes[0], this.renderSplitPane(panes[1], null, index + 1), index)
    }

    // Recursive
    const remainingPanes = panes.slice(1)
    return this.renderSplitPane(
      panes[0],
      this.renderRecursivePanes(remainingPanes, index + 1),
      index
    )
  }

  render() {
    const {panes, isMobile} = this.props

    if (panes.length === 0) {
      return <div>No panes</div>
    }

    return isMobile ? panes.map(pane => pane.element) : this.renderRecursivePanes(panes, 0)
  }
}
