/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/require-optimization */
import React from 'react'
// import PropTypes from 'prop-types'
// import CloseIcon from 'part:@sanity/base/close-icon'
import resolveContextualPreviews from 'part:@sanity/base/resolve-contextual-previews?'
import styles from './styles/ContextualPreviews.css'

class ContextualPreviews extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: null
    }
  }

  handleOpenTab = name => {
    this.setState({activeTab: name})
  }

  renderTab(context) {
    const {name, title} = context
    return (
      <div>
        <div
          className={name === this.state.activeTab ? styles.activeTab : ''}
          onClick={() => this.handleOpenTab(name)}
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
    const selectedContext = contexts.find(context => context.name === activeTab)
    return (
      <div>
        <div>
          <ol className={styles.tabList}>
            {contexts.map(context => {
              return (
                <li className={styles.tabItem} key={context.name}>
                  {this.renderTab(context)}
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
