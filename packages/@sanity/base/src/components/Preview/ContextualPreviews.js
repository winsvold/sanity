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

  renderContext = context => {}

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
    const selectedContext = contexts.find(context => context.name === activeTab)
    return (
      <div>
        <div>
          <ol className={styles.tabList}>
            {contexts.map(context => {
              return (
                <li className={styles.tabItem} key={context.name}>
                  {this.renderTab(context.name)}
                </li>
              )
            })}
          </ol>
        </div>

        {selectedContext && (
          <div>
            <h2>Preview of: {selectedContext.title}</h2>
            {selectedContext.component && selectedContext.component}
            {!selectedContext.component && selectedContext.url && (
              <iframe src={selectedContext.url} width="600" height="600" />
            )}
          </div>
        )}
      </div>
    )
  }
}

export default ContextualPreviews
