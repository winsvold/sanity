/* eslint-disable prefer-template */

import {HelpCircleIcon} from '@sanity/icons'
import React from 'react'
import {
  isSidecarOpenSetting,
  toggleSidecarOpenState,
} from 'part:@sanity/default-layout/sidecar-datastore'
import Button from 'part:@sanity/components/buttons/default'

export default class ToggleSidecarButton extends React.PureComponent {
  state = {
    isOpen: true,
  }

  componentDidMount() {
    this.subscription = isSidecarOpenSetting.listen().subscribe((isOpen) => {
      this.setState({isOpen: isOpen !== false})
    })
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  render() {
    const {isOpen} = this.state

    return (
      <Button
        aria-label="Toggle sidecar"
        aria-pressed={isOpen}
        icon={HelpCircleIcon}
        kind="simple"
        onClick={toggleSidecarOpenState}
        selected={isOpen}
        tone="navbar"
        padding="small"
      />
    )
  }
}
