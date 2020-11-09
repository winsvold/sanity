import React from 'react'

interface DelayProps {
  children?: (() => React.ReactNode) | React.ReactNode
  ms: number
}

export default class Delay extends React.Component<DelayProps> {
  state = {done: false}

  timer?: number

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({done: true})
    }, this.props.ms)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const {children} = this.props

    if (!this.state.done) {
      return null
    }

    return typeof children === 'function' ? children() : children
  }
}
