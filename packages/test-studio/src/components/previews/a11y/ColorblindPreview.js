/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state */
import React from 'react'
import PropTypes from 'prop-types'
import filters from './filters.svg'
import styles from './ColorblindPreview.css'

class ColorblindPreview extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    url: null
  }

  state = {
    activeFilter: 'protanopia',
    filters: [
      'protanopia',
      'protanomaly',
      'deuteranopia',
      'deuteranomaly',
      'tritanopia',
      'tritanomaly',
      'achromatopsia',
      'achromatomaly',
      'off'
    ]
  }

  handleFilterChange = filter => {
    this.setState({activeFilter: filter})
  }

  render() {
    return (
      <div className={styles.componentWrapper}>
        <div className={styles.filterSelection}>
          {this.state.filters.map(filt => {
            return (
              <div key={filt} className={styles.filterRadio}>
                <label>
                  <input
                    type="radio"
                    value={filt}
                    name="filters"
                    defaultChecked={this.state.activeFilter === filt}
                    onChange={() => this.handleFilterChange(filt)}
                  />
                  {filt}
                </label>
              </div>
            )
          })}
        </div>
        <div
          className={styles.iframeContainer}
          style={{filter: `url('${filters}#${this.state.activeFilter}')`}}
        >
          <iframe src={this.props.url} frameBorder="0" />
        </div>
      </div>
    )
  }
}

export default ColorblindPreview
