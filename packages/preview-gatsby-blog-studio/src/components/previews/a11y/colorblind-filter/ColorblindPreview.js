/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state */
import React from 'react'
import PropTypes from 'prop-types'
import DefaultSelect from 'part:@sanity/components/selects/default'
import filters from './filters.svg'
import styles from './ColorblindPreview.css'

const FILTER_ITEMS = [
  {title: 'Protanopia', value: 'protanopia'},
  {title: 'Deuteranopia', value: 'deuteranopia'},
  {title: 'Tritanopia', value: 'tritanopia'},
  {title: 'Achromatopsia', value: 'achromatopsia'},
  {title: 'Protanomaly', value: 'protanomaly'},
  {title: 'Deuteranomaly', value: 'deuteranomaly'},
  {title: 'Tritanomaly', value: 'tritanomaly'},
  {title: 'Achromatomaly', value: 'achromatomaly'},
  {title: 'No filter', value: ''}
]

class ColorblindPreview extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    url: ''
  }

  state = {
    activeFilter: FILTER_ITEMS[0]
  }

  handleFilterChange = filter => {
    this.setState({activeFilter: filter})
  }

  render() {
    const {url} = this.props
    return (
      <div className={styles.componentWrapper}>
        <div className={styles.filterDropdown}>
          <label className={styles.dropdownLabel} htmlFor="select-filter">
            Select a filter:
          </label>
          <DefaultSelect
            items={FILTER_ITEMS}
            value={this.state.activeFilter}
            onChange={value => this.handleFilterChange(value)}
          />
        </div>
        <div
          className={styles.iframeContainer}
          style={{filter: `url('${filters}#${this.state.activeFilter.value}')`}}
        >
          <iframe src={url} frameBorder="0" />
        </div>
      </div>
    )
  }
}

export default ColorblindPreview
