import React from 'react'
import resolveContextualPreviews from 'part:@sanity/base/resolve-contextual-previews?'
import styles from './styles/ContextualPreviews.css'

class ContextualPreviews extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'css-tricks'
    }
  }

  handleOpenTab = name => {
    this.setState({activeTab: name})
  }

  renderTab(context) {
    return (
      <div
        className={context.name === this.state.activeTab ? styles.activeTab : ''}
        onClick={() => this.handleOpenTab(context.name)}
      >
        {context.title}
      </div>
    )
  }

  renderTabContent(preview) {
    if (preview.component) return preview.component
    if (preview.url)
      return (
        <div className={styles.iframeContainer}>
          <iframe src={preview.url} frameBorder="0" />
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
    const previews = resolveContextualPreviews(currentDoc)
    return (
      <div className={styles.previewWrapper}>
        <div className={styles.tabWrapper}>
          <ol className={styles.tabList}>
            {previews.map(preview => {
              return (
                <li className={styles.tabItem} key={preview.name}>
                  {this.renderTab(preview)}
                </li>
              )
            })}
          </ol>
        </div>
        {previews.map(preview => {
          if (preview.name !== activeTab) {
            return undefined
          }
          return (
            <div className={styles.contextualPreviewContent} key={preview.name}>
              {this.renderTabContent(preview)}
            </div>
          )
        })}
      </div>
    )
  }
}

export default ContextualPreviews
