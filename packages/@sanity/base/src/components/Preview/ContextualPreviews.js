/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/require-optimization */
import React from 'react'
// import PropTypes from 'prop-types'
// import CloseIcon from 'part:@sanity/base/close-icon'
import resolveContextualPreviews from 'part:@sanity/base/resolve-contextual-previews?'
import {withDocument} from 'part:@sanity/form-builder'
import styles from './styles/ContextualPreviews.css'

class ContextualPreviews extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'example-com'
    }
  }

  handleOpenTab = tab => {
    this.setState({activeTab: tab})
  }

  renderTab(title) {
    return (
      <div>
        <div
          className={title === this.state.activeTab && styles.activeTab}
          onClick={() => this.handleOpenTab(title)}
        >
          {title}
        </div>
      </div>
    )
  }

  render() {
    const {activeTab} = this.state
    if (!resolveContextualPreviews) {
      return null
    }
    const currentDoc = {
      _id: 'fd330e83-5162-408c-bd14-a191da79974e',
      _type: 'author'
    }
    const contexts = resolveContextualPreviews(currentDoc)
    return (
      <div>
        <div>
          <ol className={styles.tabList}>
            {contexts.map(context => {
              // const {label} = context
              return (
                <li className={styles.tabItem} key={context.name}>
                  {this.renderTab(context.name)}
                </li>
              )
            })}
          </ol>
        </div>
        <div>
          {contexts.map(context => {
            if (context.name !== activeTab) {
              return undefined
            }
            return (
              <div key={context.name}>
                {context.url && <iframe src={context.url} width="600" height="600" />}
                {context.component && context.component}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ContextualPreviews
