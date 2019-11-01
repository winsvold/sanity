/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state */
import React from 'react'
import PropTypes from 'prop-types'
import DefaultSelect from 'part:@sanity/components/selects/default'
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
    activeFilter: 'Protanopia',
    filters: [
      {title: 'Protanopia'},
      {title: 'Protanomaly'},
      {title: 'Deuteranopia'},
      {title: 'Deuteranomaly'},
      {title: 'Tritanopia'},
      {title: 'Tritanomaly'},
      {title: 'Achromatopsia'},
      {title: 'Achromatomaly'},
      {title: 'Off'}
    ]
  }

  handleFilterChange = filter => {
    console.log(filter)
    this.setState({activeFilter: filter})
  }

  render() {
    return (
      <div className={styles.componentWrapper}>
        <div className={styles.filterDropdown}>
          <label className={styles.dropdownLabel} htmlFor="select-filter">
            Select a filter:
          </label>
          <DefaultSelect
            id="select-filter"
            items={this.state.filters}
            onChange={value => this.handleFilterChange(value.title)}
          />
        </div>
        <div
          className={styles.iframeContainer}
          style={{filter: `url('${filters}#${this.state.activeFilter.toLowerCase()}')`}}
        >
          <iframe src={this.props.url} frameBorder="0" />
        </div>
      </div>
    )
  }
}

export default ColorblindPreview
